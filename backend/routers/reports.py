from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from database import get_db
from services.reporting_service import get_available_reports, generate_report_csv_content

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("")
def list_reports(db: Session = Depends(get_db)):
    return get_available_reports(db)

@router.get("/{report_id}/export")
def export_report_csv(report_id: str, db: Session = Depends(get_db)):
    csv_str = generate_report_csv_content(db, report_id)
    return Response(
        content=csv_str,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={report_id}-export.csv"}
    )
