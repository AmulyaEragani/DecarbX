from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import EmissionFactor
from schemas import EmissionFactorCreate, EmissionFactorResponse
from typing import List

router = APIRouter(prefix="/api/emission-factors", tags=["Emission Factors"])

@router.get("", response_model=List[EmissionFactorResponse])
def list_emission_factors(db: Session = Depends(get_db)):
    return db.query(EmissionFactor).order_by(EmissionFactor.activity_type.asc()).all()

@router.post("", response_model=EmissionFactorResponse)
def create_emission_factor(ef_in: EmissionFactorCreate, db: Session = Depends(get_db)):
    ef = EmissionFactor(**ef_in.model_dump())
    db.add(ef)
    db.commit()
    db.refresh(ef)
    return ef
