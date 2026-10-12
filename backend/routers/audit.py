from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import AuditLog
from services.audit_service import get_audit_logs

router = APIRouter(prefix="/api/audit-logs", tags=["Audit Trail"])

@router.get("")
def list_audit_logs(limit: int = 100, db: Session = Depends(get_db)):
    logs = get_audit_logs(db, limit=limit)
    return [
        {
            "id": log.id,
            "timestamp": log.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "user": log.user,
            "action": log.action,
            "entity": log.entity,
            "description": log.description
        } for log in logs
    ]
