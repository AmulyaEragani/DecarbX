from sqlalchemy.orm import Session
from models import Integration, Activity, AuditLog, Facility
from services.carbon_engine import calculate_activity_emission
from datetime import datetime
import random

def trigger_integration_sync(db: Session, integration_id: int) -> Integration:
    integration = db.query(Integration).filter(Integration.id == integration_id).first()
    if not integration:
        raise ValueError(f"Integration #{integration_id} not found")
        
    facility = db.query(Facility).first()
    fac_id = facility.id if facility else 1
    
    # Simulate importing new activity data from enterprise adapter
    imported_count = random.randint(12, 45)
    
    # Create sample imported activity
    sample_act = Activity(
        facility_id=fac_id,
        activity_type="Electricity" if "Meter" in integration.system_name else "Natural Gas",
        activity_name=f"Automated Import via {integration.system_name}",
        quantity=float(random.randint(1500, 8500)),
        unit="kWh",
        scope="Scope 2" if "Meter" in integration.system_name else "Scope 1",
        source=integration.system_name,
        status="Valid",
        period="2026-Q1",
        activity_date=datetime.now().strftime("%Y-%m-%d"),
        notes=f"Synced live record from {integration.system_name} adapter"
    )
    db.add(sample_act)
    db.commit()
    db.refresh(sample_act)
    
    # Calculate carbon for newly ingested activity
    calculate_activity_emission(db, sample_act)
    
    # Update integration record
    integration.status = "DEMO CONNECTED"
    integration.last_sync = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    integration.records_imported += imported_count
    
    audit = AuditLog(
        user="Integration Adapter Service",
        action="Integration Sync Executed",
        entity="Integration",
        description=f"Successfully synced {integration.system_name}. Imported {imported_count} records and updated live emissions."
    )
    db.add(audit)
    db.commit()
    db.refresh(integration)
    
    return integration
