from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Supplier, SupplierScorecard, ActionPlan, SupplierQuestionnaire
from services.supplier_service import get_supplier_details, calculate_supplier_score
from typing import List, Dict, Any

router = APIRouter(prefix="/api/suppliers", tags=["Suppliers"])

@router.get("")
def list_suppliers(db: Session = Depends(get_db)):
    suppliers = db.query(Supplier).all()
    res = []
    for s in suppliers:
        latest_card = db.query(SupplierScorecard).filter(SupplierScorecard.supplier_id == s.id).order_by(SupplierScorecard.evaluated_at.desc()).first()
        res.append({
            "id": s.id,
            "name": s.name,
            "code": s.code,
            "category": s.category,
            "country": s.country,
            "status": s.status,
            "risk_level": s.risk_level,
            "data_quality_score": s.data_quality_score,
            "sustainability_score": s.sustainability_score,
            "total_emissions_tco2e": s.total_emissions_tco2e,
            "grade": latest_card.grade if latest_card else "B"
        })
    return res

@router.get("/{supplier_id}")
def get_supplier(supplier_id: int, db: Session = Depends(get_db)):
    try:
        return get_supplier_details(db, supplier_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/{supplier_id}/scorecard")
def get_scorecard(supplier_id: int, db: Session = Depends(get_db)):
    card = calculate_supplier_score(db, supplier_id)
    return card
