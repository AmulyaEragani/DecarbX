from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from services.analytics_service import get_ai_analytics_summary

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("/insights")
def get_insights(db: Session = Depends(get_db)):
    summary = get_ai_analytics_summary(db)
    return summary["insights"]

@router.get("/anomalies")
def get_anomalies(db: Session = Depends(get_db)):
    summary = get_ai_analytics_summary(db)
    return summary["anomalies"]

@router.get("/recommendations")
def get_recommendations(db: Session = Depends(get_db)):
    summary = get_ai_analytics_summary(db)
    return summary["recommendations"]

@router.get("/all")
def get_all_analytics(db: Session = Depends(get_db)):
    return get_ai_analytics_summary(db)
