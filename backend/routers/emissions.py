from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Emission, Activity
from schemas import EmissionResponse
from services.carbon_engine import calculate_activity_emission
from typing import List, Dict, Any

router = APIRouter(prefix="/api/emissions", tags=["Emissions"])

@router.get("", response_model=List[EmissionResponse])
def list_emissions(scope: str = None, db: Session = Depends(get_db)):
    query = db.query(Emission)
    if scope:
        query = query.filter(Emission.scope == scope)
    return query.order_by(Emission.created_at.desc()).all()

@router.post("/calculate/{activity_id}")
def trigger_emission_calculation(activity_id: int, db: Session = Depends(get_db)):
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail=f"Activity #{activity_id} not found")
        
    emission = calculate_activity_emission(db, activity)
    return {
        "status": "success",
        "emission_id": emission.id,
        "co2e_tonnes": emission.co2e_tonnes,
        "scope": emission.scope,
        "factor_used": emission.emission_factor_value,
        "source": emission.emission_factor_source
    }
