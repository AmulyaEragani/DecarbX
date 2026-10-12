from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Product, ProductMaterial, LCAProcess, PCFResult
from schemas import ProductCreate
from services.pcf_service import calculate_product_pcf
from services.lca_service import get_product_lca_breakdown
from typing import List, Dict, Any

router = APIRouter(prefix="/api/products", tags=["Products"])

@router.get("")
def list_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    res = []
    for p in products:
        pcf = db.query(PCFResult).filter(PCFResult.product_id == p.id).first()
        res.append({
            "id": p.id,
            "name": p.name,
            "sku": p.sku,
            "category": p.category,
            "unit": p.unit,
            "annual_volume": p.annual_volume,
            "pcf_kgco2e": p.pcf_kgco2e,
            "pcf_details": pcf
        })
    return res

@router.post("")
def create_product(product_in: ProductCreate, db: Session = Depends(get_db)):
    p = Product(**product_in.model_dump())
    db.add(p)
    db.commit()
    db.refresh(p)
    return p

@router.get("/{product_id}")
def get_product_details(product_id: int, db: Session = Depends(get_db)):
    lca_data = get_product_lca_breakdown(db, product_id)
    return lca_data

@router.post("/{product_id}/calculate-pcf")
def trigger_pcf_calculation(product_id: int, db: Session = Depends(get_db)):
    try:
        pcf_res = calculate_product_pcf(db, product_id)
        return {
            "status": "success",
            "product_id": product_id,
            "pcf_kgco2e": pcf_res.total_pcf_kgco2e,
            "raw_materials": pcf_res.raw_materials_co2e,
            "manufacturing": pcf_res.manufacturing_co2e,
            "transportation": pcf_res.transport_co2e,
            "packaging": pcf_res.packaging_co2e,
            "use_phase": pcf_res.use_phase_co2e,
            "end_of_life": pcf_res.end_of_life_co2e
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
