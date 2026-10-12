from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Evidence
from services.compliance_service import get_compliance_readiness
from typing import Dict, Any

router = APIRouter(tags=["Compliance"])

@router.get("/api/compliance")
def get_compliance_info(db: Session = Depends(get_db)):
    return get_compliance_readiness(db)

@router.get("/api/evidence")
def list_evidence_documents(db: Session = Depends(get_db)):
    return db.query(Evidence).all()
