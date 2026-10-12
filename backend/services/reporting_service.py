from sqlalchemy.orm import Session
from models import Emission, Facility, Activity, Supplier, Product, ReductionProject
from typing import Dict, Any, List

def get_available_reports(db: Session) -> List[Dict[str, Any]]:
    return [
        {
            "id": "rep-annual",
            "name": "Annual Enterprise Carbon Inventory Report",
            "category": "Corporate Sustainability",
            "description": "Comprehensive Scope 1, Scope 2, and Scope 3 greenhouse gas emissions summary by facility and reporting period.",
            "period": "2026-YTD",
            "format": "CSV / PDF Summary",
            "status": "Generated"
        },
        {
            "id": "rep-scope1",
            "name": "Scope 1 Direct Emissions Detailed Breakdown",
            "category": "Carbon Accounting",
            "description": "Granular analysis of natural gas combustion, stationary sources, mobile fleet, and fugitive emissions.",
            "period": "2026-Q1",
            "format": "CSV Export",
            "status": "Ready"
        },
        {
            "id": "rep-scope2",
            "name": "Scope 2 Purchased Energy & Renewable Tracking",
            "category": "Carbon Accounting",
            "description": "Location-based vs market-based Scope 2 emissions including renewable energy certificate (REC) allocations.",
            "period": "2026-Q1",
            "format": "CSV Export",
            "status": "Ready"
        },
        {
            "id": "rep-scope3",
            "name": "Scope 3 Value Chain & Supply Chain Footprint",
            "category": "Scope 3",
            "description": "Category 1-15 breakdown, supplier contribution ranking, and upstream logistics carbon intensity.",
            "period": "2026-Q1",
            "format": "CSV Export",
            "status": "Ready"
        },
        {
            "id": "rep-supplier",
            "name": "Supplier Sustainability & Scorecard Assessment",
            "category": "Suppliers",
            "description": "ESG ratings, Scope 3 data completeness scores, risk levels, and action plan compliance for top 50 vendors.",
            "period": "2026-Q1",
            "format": "CSV Export",
            "status": "Ready"
        },
        {
            "id": "rep-pcf",
            "name": "Product Carbon Footprint (PCF) & LCA Declaration",
            "category": "Product Footprint",
            "description": "ISO 14067 compliant lifecycle carbon footprint results per SKU, stage by stage.",
            "period": "2026-Q1",
            "format": "CSV Export",
            "status": "Ready"
        },
        {
            "id": "rep-reduction",
            "name": "Decarbonization Targets & Project Progress Report",
            "category": "Reduction Planning",
            "description": "Tracking vs Net-Zero 2030 targets, capital expenditure, tCO2e reduced, and marginal abatement cost curve.",
            "period": "2026-Q1",
            "format": "CSV Export",
            "status": "Ready"
        }
    ]

def generate_report_csv_content(db: Session, report_id: str) -> str:
    emissions = db.query(Emission).all()
    
    csv_lines = ["Facility,Activity Type,Scope,Quantity,Unit,Emission Factor,tCO2e,Period"]
    for e in emissions:
        act_type = e.activity.activity_type if e.activity else "General"
        fac_name = e.facility.name if e.facility else "Plant A"
        line = f'"{fac_name}","{act_type}","{e.scope}",{e.quantity},"{e.unit}",{e.emission_factor_value},{e.co2e_tonnes},"{e.period}"'
        csv_lines.append(line)
        
    return "\n".join(csv_lines)
