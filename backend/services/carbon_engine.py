from sqlalchemy.orm import Session
from models import Activity, EmissionFactor, Emission, AuditLog
from datetime import datetime

# Standard demo emission factors reference dictionary (kg CO2e per unit)
DEFAULT_EMISSION_FACTORS = {
    # Scope 1
    ("Natural Gas", "kWh"): 0.183,
    ("Natural Gas", "MWh"): 183.0,
    ("Diesel", "litres"): 2.68,
    ("Petrol", "litres"): 2.31,
    ("Company Vehicles", "km"): 0.171,
    ("Onsite Combustion", "kg"): 2.85,
    # Scope 2
    ("Electricity", "kWh"): 0.420,  # Grid average
    ("Electricity", "MWh"): 420.0,
    ("Purchased Steam", "kWh"): 0.170,
    ("Purchased Heating", "kWh"): 0.190,
    # Scope 3
    ("Purchased Goods", "kg"): 1.45,
    ("Transportation", "km"): 0.210,
    ("Business Travel", "km"): 0.150,
    ("Passenger Travel", "passenger-km"): 0.115,
    ("Employee Commuting", "km"): 0.125,
    ("Waste", "kg"): 0.450,
    ("Upstream Logistics", "tonnes"): 1.85,
    ("Downstream Logistics", "tonnes"): 1.20,
    ("Supplier Emissions", "kg"): 1.65,
}

def get_matching_emission_factor(db: Session, activity_type: str, unit: str):
    # Try finding in database first
    factor_obj = db.query(EmissionFactor).filter(
        EmissionFactor.activity_type == activity_type,
        EmissionFactor.unit == unit
    ).first()
    
    if factor_obj:
        return factor_obj.factor, factor_obj.source
    
    # Fallback to default reference mapping
    key = (activity_type, unit)
    if key in DEFAULT_EMISSION_FACTORS:
        return DEFAULT_EMISSION_FACTORS[key], "DEFRA / EPA Standard 2025"
    
    # Fuzzy match on activity type
    for (act, un), val in DEFAULT_EMISSION_FACTORS.items():
        if act.lower() in activity_type.lower() and un.lower() == unit.lower():
            return val, "DEFRA / EPA Standard Reference"
            
    # Default emergency estimate factor
    return 0.5, "Default Standard Estimate"

def calculate_activity_emission(db: Session, activity: Activity) -> Emission:
    factor_val, source = get_matching_emission_factor(db, activity.activity_type, activity.unit)
    
    # Calculate emissions in kg CO2e
    co2e_kg = activity.quantity * factor_val
    # Convert to metric tonnes CO2e
    co2e_tonnes = round(co2e_kg / 1000.0, 4)
    
    # Existing emission record check
    existing_emission = db.query(Emission).filter(Emission.activity_id == activity.id).first()
    if existing_emission:
        existing_emission.quantity = activity.quantity
        existing_emission.unit = activity.unit
        existing_emission.emission_factor_value = factor_val
        existing_emission.emission_factor_source = source
        existing_emission.co2e_tonnes = co2e_tonnes
        existing_emission.scope = activity.scope
        existing_emission.period = activity.period
        existing_emission.date = activity.activity_date
        db.commit()
        db.refresh(existing_emission)
        return existing_emission
    
    new_emission = Emission(
        activity_id=activity.id,
        facility_id=activity.facility_id,
        scope=activity.scope,
        quantity=activity.quantity,
        unit=activity.unit,
        emission_factor_value=factor_val,
        emission_factor_source=source,
        co2e_tonnes=co2e_tonnes,
        period=activity.period,
        date=activity.activity_date
    )
    db.add(new_emission)
    db.commit()
    db.refresh(new_emission)
    
    # Add audit log entry
    audit = AuditLog(
        user="Carbon Engine Service",
        action="Emission Calculated",
        entity="Emission",
        description=f"Calculated {co2e_tonnes} tCO2e for Activity #{activity.id} ({activity.activity_type}, {activity.quantity} {activity.unit})"
    )
    db.add(audit)
    db.commit()
    
    return new_emission
