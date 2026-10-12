from sqlalchemy.orm import Session
from models import AuditLog
from typing import List, Dict, Any

def get_audit_logs(db: Session, limit: int = 100) -> List[AuditLog]:
    return db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit).all()

def log_audit_event(db: Session, user: str, action: str, entity: str, description: str) -> AuditLog:
    audit = AuditLog(
        user=user,
        action=action,
        entity=entity,
        description=description
    )
    db.add(audit)
    db.commit()
    db.refresh(audit)
    return audit
