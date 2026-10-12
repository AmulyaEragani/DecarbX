from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database import get_db
from models import Emission, Facility, Activity, Supplier, ReductionTarget, AuditLog
from typing import Dict, Any, Optional
from collections import defaultdict

router = APIRouter(prefix="/api", tags=["Dashboard"])

@router.get("/facilities")
def list_facilities(db: Session = Depends(get_db)):
    return db.query(Facility).all()

@router.get("/dashboard")
def get_dashboard_summary(
    facility_id: Optional[int] = Query(None),
    period: Optional[str] = Query(None),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    query = db.query(Emission)
    
    if facility_id:
        query = query.filter(Emission.facility_id == facility_id)
    if period and period != "ALL":
        # Handle period filter (e.g. 2026-Q1, 2025-YTD, 2025-Q4)
        if period == "2025-YTD":
            query = query.filter(Emission.period.like("2025%"))
        else:
            query = query.filter(Emission.period == period)
            
    emissions = query.all()
    facilities = db.query(Facility).all()
    target = db.query(ReductionTarget).first()
    
    # Filter recent activities and audits
    act_query = db.query(Activity)
    if facility_id:
        act_query = act_query.filter(Activity.facility_id == facility_id)
    recent_activities = act_query.order_by(Activity.created_at.desc()).limit(5).all()
    recent_audits = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(5).all()
    
    total_co2e = sum(e.co2e_tonnes for e in emissions)
    scope1_co2e = sum(e.co2e_tonnes for e in emissions if e.scope == "Scope 1")
    scope2_co2e = sum(e.co2e_tonnes for e in emissions if e.scope == "Scope 2")
    scope3_co2e = sum(e.co2e_tonnes for e in emissions if e.scope == "Scope 3")
    
    # Calculate Data Quality Score dynamically from Activity table
    all_activities = db.query(Activity).all()
    if all_activities:
        valid_cnt = sum(1 for a in all_activities if a.status == "Valid")
        warn_cnt = sum(1 for a in all_activities if a.status == "Warning")
        dq_score = round(((valid_cnt + (warn_cnt * 0.5)) / len(all_activities)) * 100.0, 1)
    else:
        dq_score = 96.8

    # Calculate Target Progress % dynamically
    if target and target.baseline_emissions_tco2e > target.target_emissions_tco2e:
        # Total baseline emissions
        all_emissions_total = sum(e.co2e_tonnes for e in db.query(Emission).all())
        req_reduction = target.baseline_emissions_tco2e - target.target_emissions_tco2e
        curr_reduction = max(0.0, target.baseline_emissions_tco2e - all_emissions_total)
        target_progress_pct = round((curr_reduction / max(req_reduction, 1.0)) * 100.0, 1)
    else:
        target_progress_pct = 29.7

    # Dynamic Monthly Trend Chart
    monthly_map = defaultdict(lambda: {"scope1": 0.0, "scope2": 0.0, "scope3": 0.0, "total": 0.0})
    for e in emissions:
        m_key = e.period if e.period else "2026-Q1"
        if e.scope == "Scope 1":
            monthly_map[m_key]["scope1"] += e.co2e_tonnes
        elif e.scope == "Scope 2":
            monthly_map[m_key]["scope2"] += e.co2e_tonnes
        elif e.scope == "Scope 3":
            monthly_map[m_key]["scope3"] += e.co2e_tonnes
        monthly_map[m_key]["total"] += e.co2e_tonnes

    sorted_periods = sorted(monthly_map.keys())
    if not sorted_periods:
        sorted_periods = ["2025-Q2", "2025-Q3", "2025-Q4", "2026-Q1"]
        
    monthly_trend = []
    for p_name in sorted_periods:
        m_data = monthly_map[p_name]
        monthly_trend.append({
            "month": p_name,
            "scope1": round(m_data["scope1"], 1),
            "scope2": round(m_data["scope2"], 1),
            "scope3": round(m_data["scope3"], 1),
            "total": round(m_data["total"], 1)
        })

    # Facility breakdown
    fac_breakdown = []
    for f in facilities:
        if facility_id and f.id != facility_id:
            continue
        f_em = sum(e.co2e_tonnes for e in emissions if e.facility_id == f.id)
        fac_breakdown.append({
            "name": f.name.split(" - ")[0],
            "emissions_tco2e": round(f_em, 1),
            "sqm": f.square_meters,
            "intensity": round(f_em / max(f.square_meters, 1.0), 3)
        })

    # Source breakdown aggregated from activities
    source_map = defaultdict(lambda: {"tco2e": 0.0, "scope": "Scope 1"})
    for e in emissions:
        act_name = e.activity.activity_type if e.activity else "General Combustion"
        source_map[act_name]["tco2e"] += e.co2e_tonnes
        source_map[act_name]["scope"] = e.scope
        
    source_breakdown = []
    for s_name, s_data in sorted(source_map.items(), key=lambda x: x[1]["tco2e"], reverse=True):
        source_breakdown.append({
            "name": s_name,
            "tco2e": round(s_data["tco2e"], 1),
            "scope": s_data["scope"]
        })
        
    if not source_breakdown:
        source_breakdown = [
            {"name": "Grid Electricity", "tco2e": 0.0, "scope": "Scope 2"},
            {"name": "Natural Gas Combustion", "tco2e": 0.0, "scope": "Scope 1"}
        ]

    # Scope 3 Category Breakdown
    scope3_map = defaultdict(float)
    for e in emissions:
        if e.scope == "Scope 3":
            act_name = e.activity.activity_type if e.activity else "Scope 3 Goods"
            scope3_map[act_name] += e.co2e_tonnes
            
    scope3_categories = []
    for cat_name, cat_val in sorted(scope3_map.items(), key=lambda x: x[1], reverse=True):
        scope3_categories.append({
            "category": cat_name,
            "tco2e": round(cat_val, 1)
        })
        
    if not scope3_categories:
        scope3_categories = [{"category": "Purchased Goods", "tco2e": 0.0}]

    return {
        "metrics": {
            "total_emissions_tco2e": round(total_co2e, 1),
            "scope1_tco2e": round(scope1_co2e, 1),
            "scope2_tco2e": round(scope2_co2e, 1),
            "scope3_tco2e": round(scope3_co2e, 1),
            "emission_intensity": round(total_co2e / 100000.0, 2),
            "target_progress_pct": target_progress_pct,
            "data_quality_score": dq_score
        },
        "target_summary": {
            "name": target.name if target else "2030 Science-Based Net-Zero Target",
            "baseline_tco2e": target.baseline_emissions_tco2e if target else 42680.0,
            "target_tco2e": target.target_emissions_tco2e if target else 30000.0,
            "current_tco2e": round(total_co2e, 1),
            "reduction_pct": target.reduction_pct if target else 29.7,
            "status": target.status if target else "On Track"
        },
        "charts": {
            "monthly_trend": monthly_trend,
            "facility_breakdown": fac_breakdown,
            "source_breakdown": source_breakdown,
            "scope3_categories": scope3_categories,
            "scope_pie": [
                {"name": "Scope 1", "value": round(scope1_co2e, 1)},
                {"name": "Scope 2", "value": round(scope2_co2e, 1)},
                {"name": "Scope 3", "value": round(scope3_co2e, 1)}
            ]
        },
        "recent_activities": [
            {
                "id": a.id,
                "activity_name": a.activity_name or a.activity_type,
                "quantity": a.quantity,
                "unit": a.unit,
                "scope": a.scope,
                "source": a.source,
                "created_at": a.created_at.strftime("%Y-%m-%d %H:%M")
            } for a in recent_activities
        ],
        "recent_audits": [
            {
                "id": au.id,
                "user": au.user,
                "action": au.action,
                "entity": au.entity,
                "description": au.description,
                "timestamp": au.timestamp.strftime("%Y-%m-%d %H:%M")
            } for au in recent_audits
        ]
    }
