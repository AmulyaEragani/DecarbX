from sqlalchemy.orm import Session
from models import Supplier, SupplierQuestionnaire, SupplierScorecard, ActionPlan, AuditLog
from typing import Dict, Any, List

def calculate_supplier_score(db: Session, supplier_id: int) -> SupplierScorecard:
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not supplier:
        raise ValueError(f"Supplier #{supplier_id} not found")
        
    questionnaires = db.query(SupplierQuestionnaire).filter(SupplierQuestionnaire.supplier_id == supplier_id).all()
    action_plans = db.query(ActionPlan).filter(ActionPlan.supplier_id == supplier_id).all()
    
    # Transparent score calculation formula
    base_dq = supplier.data_quality_score or 75.0
    
    if questionnaires:
        avg_q_score = sum(q.score for q in questionnaires) / len(questionnaires)
        net_zero_bonus = 10.0 if any(q.net_zero_commitment for q in questionnaires) else 0.0
        renewable_contrib = sum(q.renewable_pct for q in questionnaires) / len(questionnaires) * 0.2
    else:
        avg_q_score = 65.0
        net_zero_bonus = 0.0
        renewable_contrib = 5.0
        
    carbon_score = min(100.0, round(avg_q_score * 0.7 + net_zero_bonus + renewable_contrib, 1))
    governance_score = 80.0 if action_plans else 60.0
    
    total_score = round((carbon_score * 0.45) + (base_dq * 0.35) + (governance_score * 0.20), 1)
    
    if total_score >= 88:
        grade = "A+"
        risk = "Low"
    elif total_score >= 80:
        grade = "A"
        risk = "Low"
    elif total_score >= 70:
        grade = "B"
        risk = "Medium"
    elif total_score >= 58:
        grade = "C"
        risk = "Medium"
    else:
        grade = "D"
        risk = "High"
        
    supplier.sustainability_score = total_score
    supplier.risk_level = risk
    
    scorecard = SupplierScorecard(
        supplier_id=supplier_id,
        period="2026-Q1",
        carbon_score=carbon_score,
        data_quality_score=base_dq,
        governance_score=governance_score,
        total_score=total_score,
        grade=grade
    )
    db.add(scorecard)
    db.commit()
    db.refresh(scorecard)
    return scorecard

def get_supplier_details(db: Session, supplier_id: int) -> Dict[str, Any]:
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not supplier:
        raise ValueError(f"Supplier #{supplier_id} not found")
        
    questionnaires = db.query(SupplierQuestionnaire).filter(SupplierQuestionnaire.supplier_id == supplier_id).all()
    scorecards = db.query(SupplierScorecard).filter(SupplierScorecard.supplier_id == supplier_id).order_by(SupplierScorecard.evaluated_at.desc()).all()
    plans = db.query(ActionPlan).filter(ActionPlan.supplier_id == supplier_id).all()
    
    missing_evidence = []
    if supplier.data_quality_score < 75.0:
        missing_evidence.append("Scope 1 & 2 Third-Party Verification Certificate")
    if not any(q.net_zero_commitment for q in questionnaires):
        missing_evidence.append("SBTi Approved Science-Based Net-Zero Roadmap")
    if not plans:
        missing_evidence.append("2026 Carbon Reduction Action Plan")
        
    recommended_actions = []
    if supplier.risk_level == "High":
        recommended_actions.append("Issue Mandatory ESG Action Plan & Conduct On-Site Energy Audit")
        recommended_actions.append("Request Monthly Energy & Emission Activity Data Uploads")
    elif supplier.risk_level == "Medium":
        recommended_actions.append("Engage in Renewable Energy PPA Co-Procurement Program")
    else:
        recommended_actions.append("Maintain Annual CDP / DecarbX Verification Audit")
        
    return {
        "supplier": {
            "id": supplier.id,
            "name": supplier.name,
            "code": supplier.code,
            "category": supplier.category,
            "country": supplier.country,
            "status": supplier.status,
            "risk_level": supplier.risk_level,
            "data_quality_score": supplier.data_quality_score,
            "sustainability_score": supplier.sustainability_score,
            "total_emissions_tco2e": supplier.total_emissions_tco2e,
            "contact_email": supplier.contact_email
        },
        "missing_evidence": missing_evidence,
        "recommended_actions": recommended_actions,
        "latest_scorecard": scorecards[0] if scorecards else None,
        "action_plans": plans,
        "questionnaires": questionnaires
    }
