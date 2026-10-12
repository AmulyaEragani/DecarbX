from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Scenario
from schemas import ScenarioSimulateRequest, ScenarioCreate
from services.scenario_service import simulate_decarbonization_scenario, save_scenario
from typing import List

router = APIRouter(prefix="/api/scenarios", tags=["Scenarios"])

@router.get("")
def list_scenarios(db: Session = Depends(get_db)):
    return db.query(Scenario).order_by(Scenario.created_at.desc()).all()

@router.post("/simulate")
def simulate_scenario(req: ScenarioSimulateRequest, db: Session = Depends(get_db)):
    return simulate_decarbonization_scenario(
        db,
        req.renewable_energy_pct,
        req.transport_reduction_pct,
        req.material_efficiency_pct,
        req.supplier_improvement_pct,
        req.energy_efficiency_pct
    )

@router.post("")
def create_scenario(req: ScenarioCreate, db: Session = Depends(get_db)):
    return save_scenario(
        db,
        req.name,
        req.description or "Custom decarbonization simulation scenario",
        req.renewable_energy_pct,
        req.transport_reduction_pct,
        req.material_efficiency_pct,
        req.supplier_improvement_pct,
        req.energy_efficiency_pct
    )
