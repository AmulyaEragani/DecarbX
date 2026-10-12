from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db
from models import Activity, Facility, AuditLog
from schemas import ActivityCreate, ActivityResponse
from services.validation_service import validate_activity_record, process_and_validate_csv
from services.carbon_engine import calculate_activity_emission
import pandas as pd
import io
from typing import List, Dict, Any

router = APIRouter(prefix="/api/activities", tags=["Activities"])

@router.get("", response_model=List[ActivityResponse])
def list_activities(db: Session = Depends(get_db)):
    return db.query(Activity).order_by(Activity.created_at.desc()).all()

@router.post("", response_model=ActivityResponse)
def create_activity(activity_in: ActivityCreate, db: Session = Depends(get_db)):
    rec_dict = activity_in.model_dump()
    facility = db.query(Facility).filter(Facility.id == activity_in.facility_id).first()
    if not facility:
        rec_dict["facility"] = "Plant A"
    else:
        rec_dict["facility"] = facility.name
        
    val_res = validate_activity_record(rec_dict)
    if val_res["status"] == "Rejected":
        raise HTTPException(status_code=400, detail=f"Validation failed: {', '.join(val_res['errors'])}")
        
    act = Activity(
        facility_id=activity_in.facility_id,
        department_id=activity_in.department_id,
        activity_type=activity_in.activity_type,
        activity_name=activity_in.activity_name or activity_in.activity_type,
        quantity=activity_in.quantity,
        unit=activity_in.unit,
        scope=activity_in.scope,
        source=activity_in.source or "Manual",
        status=val_res["status"],
        period=activity_in.period,
        activity_date=activity_in.activity_date,
        notes=activity_in.notes
    )
    db.add(act)
    db.commit()
    db.refresh(act)
    
    # Calculate carbon emission automatically
    calculate_activity_emission(db, act)
    
    return act

@router.post("/upload")
async def upload_activities_csv(file: UploadFile = File(...), db: Session = Depends(get_db)) -> Dict[str, Any]:
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
        
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))
    
    validation_res = process_and_validate_csv(df)
    
    # Auto-import valid records into DB
    imported_count = 0
    facilities = {f.name.lower(): f.id for f in db.query(Facility).all()}
    default_fac_id = next(iter(facilities.values())) if facilities else 1
    
    for item in validation_res["items"]:
        if item["status"] in ["Valid", "Warning"]:
            rec = item["record"]
            fac_name = str(rec.get("facility", "Plant A")).strip()
            fac_id = facilities.get(fac_name.lower(), default_fac_id)
            
            act = Activity(
                facility_id=fac_id,
                activity_type=str(rec.get("activity", rec.get("activity_type", "Electricity"))),
                activity_name=f"CSV Upload: {rec.get('activity', 'Activity')}",
                quantity=float(rec.get("quantity", 100)),
                unit=str(rec.get("unit", "kWh")),
                scope=str(rec.get("scope", "Scope 2")),
                source="CSV Upload",
                status=item["status"],
                period=str(rec.get("period", "2026-Q1")),
                activity_date=str(rec.get("activity_date", "2026-01-15"))
            )
            db.add(act)
            db.commit()
            db.refresh(act)
            
            calculate_activity_emission(db, act)
            imported_count += 1
            
    audit = AuditLog(
        user="Enterprise User",
        action="CSV Activity Import",
        entity="Activity",
        description=f"Uploaded CSV '{file.filename}'. Processed {validation_res['total_processed']} rows, imported {imported_count} valid records (Quality score: {validation_res['data_quality_score']}%)."
    )
    db.add(audit)
    db.commit()
    
    validation_res["imported_count"] = imported_count
    return validation_res
