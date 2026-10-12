from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Integration
from services.integration_service import trigger_integration_sync
from typing import List

router = APIRouter(prefix="/api/integrations", tags=["Integrations"])

@router.get("")
def list_integrations(db: Session = Depends(get_db)):
    return db.query(Integration).all()

@router.post("/{integration_id}/sync")
def sync_integration(integration_id: int, db: Session = Depends(get_db)):
    try:
        updated = trigger_integration_sync(db, integration_id)
        return {
            "status": "success",
            "system_name": updated.system_name,
            "last_sync": updated.last_sync,
            "records_imported": updated.records_imported,
            "message": f"Successfully synchronized {updated.system_name} enterprise adapter."
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
