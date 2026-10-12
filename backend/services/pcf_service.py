from sqlalchemy.orm import Session
from models import Product, ProductMaterial, LCAProcess, PCFResult, AuditLog
from datetime import datetime

def calculate_product_pcf(db: Session, product_id: int) -> PCFResult:
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise ValueError(f"Product #{product_id} not found")
        
    materials = db.query(ProductMaterial).filter(ProductMaterial.product_id == product_id).all()
    lca_procs = db.query(LCAProcess).filter(LCAProcess.product_id == product_id).all()
    
    raw_materials_co2e = sum(m.co2e_kg for m in materials)
    
    mfg_co2e = sum(p.co2e_kg for p in lca_procs if p.stage == "Manufacturing")
    transport_co2e = sum(p.co2e_kg for p in lca_procs if p.stage == "Transportation")
    packaging_co2e = sum(p.co2e_kg for p in lca_procs if p.stage == "Packaging")
    use_phase_co2e = sum(p.co2e_kg for p in lca_procs if p.stage == "Use Phase")
    eol_co2e = sum(p.co2e_kg for p in lca_procs if p.stage == "End of Life")
    
    # Fallback default proportions if LCA process detail is empty
    if mfg_co2e == 0 and raw_materials_co2e > 0:
        mfg_co2e = round(raw_materials_co2e * 0.45, 2)
        transport_co2e = round(raw_materials_co2e * 0.25, 2)
        packaging_co2e = round(raw_materials_co2e * 0.12, 2)
        use_phase_co2e = round(raw_materials_co2e * 0.10, 2)
        eol_co2e = round(raw_materials_co2e * 0.08, 2)
        
    total_pcf = round(raw_materials_co2e + mfg_co2e + transport_co2e + packaging_co2e + use_phase_co2e + eol_co2e, 2)
    
    pcf_result = db.query(PCFResult).filter(PCFResult.product_id == product_id).first()
    if not pcf_result:
        pcf_result = PCFResult(product_id=product_id)
        db.add(pcf_result)
        
    pcf_result.raw_materials_co2e = raw_materials_co2e
    pcf_result.manufacturing_co2e = mfg_co2e
    pcf_result.transport_co2e = transport_co2e
    pcf_result.packaging_co2e = packaging_co2e
    pcf_result.use_phase_co2e = use_phase_co2e
    pcf_result.end_of_life_co2e = eol_co2e
    pcf_result.total_pcf_kgco2e = total_pcf
    pcf_result.calculated_at = datetime.utcnow()
    
    product.pcf_kgco2e = total_pcf
    
    audit = AuditLog(
        user="PCF Engine Service",
        action="PCF Calculated",
        entity="Product",
        description=f"Calculated PCF of {total_pcf} kgCO2e/unit for product '{product.name}' (SKU: {product.sku})"
    )
    db.add(audit)
    
    db.commit()
    db.refresh(pcf_result)
    return pcf_result
