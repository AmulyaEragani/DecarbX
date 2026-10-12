from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import ReductionTarget, ReductionProject
from typing import Dict, Any

router = APIRouter(prefix="/api/reduction", tags=["Reduction Planning"])

@router.get("/targets")
def get_reduction_targets(db: Session = Depends(get_db)):
    return db.query(ReductionTarget).all()

@router.get("/projects")
def get_reduction_projects(db: Session = Depends(get_db)):
    return db.query(ReductionProject).all()
