from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import CarbonBudget, ReductionProject
from services.finance_service import get_carbon_finance_summary
from typing import Dict, Any

router = APIRouter(prefix="/api/finance", tags=["Carbon Finance"])

@router.get("/summary")
def get_finance_overview(db: Session = Depends(get_db)):
    return get_carbon_finance_summary(db)

@router.get("/projects")
def list_finance_projects(db: Session = Depends(get_db)):
    return db.query(ReductionProject).all()

@router.get("/budget")
def list_carbon_budgets(db: Session = Depends(get_db)):
    return db.query(CarbonBudget).all()
