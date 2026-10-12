import pandas as pd
from typing import List, Dict, Any

VALID_UNITS = {"kWh", "MWh", "litres", "kg", "tonnes", "km", "passenger-km", "pkm"}
VALID_SCOPES = {"Scope 1", "Scope 2", "Scope 3"}
KNOWN_ACTIVITIES = {
    "Natural Gas", "Diesel", "Petrol", "Company Vehicles", "Onsite Combustion",
    "Electricity", "Purchased Steam", "Purchased Heating",
    "Purchased Goods", "Transportation", "Business Travel", "Passenger Travel",
    "Employee Commuting", "Waste", "Upstream Logistics", "Downstream Logistics", "Supplier Emissions"
}

def validate_activity_record(record: Dict[str, Any]) -> Dict[str, Any]:
    warnings = []
    errors = []
    
    facility = str(record.get("facility", "")).strip()
    activity_type = str(record.get("activity", record.get("activity_type", ""))).strip()
    quantity = record.get("quantity")
    unit = str(record.get("unit", "")).strip()
    scope = str(record.get("scope", "")).strip()
    
    if not facility:
        errors.append("Missing facility name")
    if not activity_type:
        errors.append("Missing activity name")
    
    try:
        qty_val = float(quantity)
        if qty_val < 0:
            errors.append(f"Negative quantity value: {qty_val}")
        elif qty_val == 0:
            warnings.append("Zero quantity recorded")
    except (ValueError, TypeError):
        errors.append(f"Invalid numeric quantity: {quantity}")
        
    if unit not in VALID_UNITS:
        warnings.append(f"Unstandardized unit '{unit}'. Engine will normalize if possible.")
        
    if scope not in VALID_SCOPES:
        errors.append(f"Invalid scope '{scope}'. Must be Scope 1, Scope 2, or Scope 3.")
        
    if activity_type not in KNOWN_ACTIVITIES:
        warnings.append(f"Unrecognized activity type '{activity_type}'. Custom factor mapping will apply.")
        
    status = "Valid"
    if errors:
        status = "Rejected"
    elif warnings:
        status = "Warning"
        
    return {
        "record": record,
        "status": status,
        "errors": errors,
        "warnings": warnings
    }

def process_and_validate_csv(df: pd.DataFrame) -> Dict[str, Any]:
    total_records = len(df)
    valid_records = 0
    warnings_count = 0
    rejected_records = 0
    processed_items = []
    
    for idx, row in df.iterrows():
        rec_dict = row.to_dict()
        res = validate_activity_record(rec_dict)
        processed_items.append(res)
        
        if res["status"] == "Valid":
            valid_records += 1
        elif res["status"] == "Warning":
            warnings_count += 1
        else:
            rejected_records += 1
            
    quality_score = round(((valid_records + (warnings_count * 0.5)) / max(total_records, 1)) * 100.0, 1)
    
    return {
        "total_processed": total_records,
        "valid_count": valid_records,
        "warnings_count": warnings_count,
        "rejected_count": rejected_records,
        "data_quality_score": quality_score,
        "items": processed_items
    }
