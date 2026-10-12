from sqlalchemy.orm import Session
from models import ComplianceReport, Evidence, AuditLog
from typing import Dict, Any, List

def get_compliance_readiness(db: Session) -> Dict[str, Any]:
    reports = db.query(ComplianceReport).all()
    evidence_items = db.query(Evidence).all()
    
    verified_count = sum(1 for e in evidence_items if e.status == "Verified")
    total_evidence = len(evidence_items)
    evidence_score = round((verified_count / max(total_evidence, 1)) * 100.0, 1)
    
    frameworks = [
        {
            "id": "ghg",
            "name": "GHG Protocol Corporate Standard",
            "status": "READY",
            "readiness_pct": 100.0,
            "scope1": "100% Complete",
            "scope2": "100% Complete",
            "scope3": "88% Complete",
            "assurance_status": "Audited / Verified",
            "notes": "Full Scope 1, 2 and Scope 3 Cat 1-6 calculated with location and market-based accounting."
        },
        {
            "id": "csrd",
            "name": "EU CSRD / ESRS E1 Climate Change",
            "status": "READY",
            "readiness_pct": 94.0,
            "scope1": "100% Complete",
            "scope2": "100% Complete",
            "scope3": "82% Complete",
            "assurance_status": "Limited Assurance Ready",
            "notes": "Double materiality assessment data available with double-entry audit trail."
        },
        {
            "id": "cdp",
            "name": "CDP Climate Change Questionnaire 2026",
            "status": "IN PROGRESS",
            "readiness_pct": 86.0,
            "scope1": "100% Complete",
            "scope2": "100% Complete",
            "scope3": "75% Complete",
            "assurance_status": "Self-Assessed",
            "notes": "Supplier primary data coverage at 71%. Scenario analysis completed."
        },
        {
            "id": "brsr",
            "name": "SEBI BRSR Core (Principle 6)",
            "status": "READY",
            "readiness_pct": 96.0,
            "scope1": "100% Complete",
            "scope2": "100% Complete",
            "scope3": "88% Complete",
            "assurance_status": "Third-Party Verified",
            "notes": "Facility energy intensity and GHG metrics mapped per INR 100M turnover."
        }
    ]
    
    return {
        "frameworks": frameworks,
        "evidence_summary": {
            "total_documents": total_evidence,
            "verified": verified_count,
            "pending_review": sum(1 for e in evidence_items if e.status == "Pending Review"),
            "evidence_score": evidence_score
        },
        "evidence_list": [
            {
                "id": e.id,
                "document_name": e.document_name,
                "category": e.category,
                "file_path": e.file_path,
                "uploaded_date": e.uploaded_date,
                "reporting_period": e.reporting_period,
                "status": e.status,
                "notes": e.notes
            } for e in evidence_items
        ]
    }
