from database import SessionLocal, engine, Base
import models
from datetime import datetime, timedelta
import random

def seed_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        print("Seeding DecarbX database...")
        
        # 1. Organization
        org = models.Organization(
            name="Acme Manufacturing Group",
            code="ACME-GLOBAL",
            industry="Heavy Industrial & Advanced Manufacturing"
        )
        db.add(org)
        db.commit()
        db.refresh(org)
        
        # 2. Facilities
        fac1 = models.Facility(org_id=org.id, name="Plant A - Automotive Assembly", facility_type="Manufacturing", location="Stuttgart", country="Germany", square_meters=45000)
        fac2 = models.Facility(org_id=org.id, name="Plant B - Metal Stamping", facility_type="Manufacturing", location="Detroit", country="USA", square_meters=38000)
        fac3 = models.Facility(org_id=org.id, name="Plant C - Electronics & Sensors", facility_type="Manufacturing", location="Hsinchu", country="Taiwan", square_meters=28000)
        fac4 = models.Facility(org_id=org.id, name="Global Logistics & Distribution Center", facility_type="Distribution", location="Rotterdam", country="Netherlands", square_meters=52000)
        
        db.add_all([fac1, fac2, fac3, fac4])
        db.commit()
        
        facilities = [fac1, fac2, fac3, fac4]
        
        # 3. Departments
        deps = []
        for f in facilities:
            d1 = models.Department(facility_id=f.id, name="Operations & Machining", code=f"DEP-OPS-{f.id}")
            d2 = models.Department(facility_id=f.id, name="Facilities & Utilities", code=f"DEP-UTIL-{f.id}")
            d3 = models.Department(facility_id=f.id, name="Logistics & Fleet", code=f"DEP-LOG-{f.id}")
            deps.extend([d1, d2, d3])
        db.add_all(deps)
        db.commit()
        
        # 4. Emission Factors
        efs = [
            # Scope 1
            models.EmissionFactor(activity_type="Natural Gas", unit="kWh", factor=0.183, source="DEFRA 2025", scope="Scope 1", is_demo=True),
            models.EmissionFactor(activity_type="Diesel Fuel", unit="litres", factor=2.68, source="EPA GHG 2025", scope="Scope 1", is_demo=True),
            models.EmissionFactor(activity_type="Petrol Fuel", unit="litres", factor=2.31, source="DEFRA 2025", scope="Scope 1", is_demo=True),
            models.EmissionFactor(activity_type="Company Fleet", unit="km", factor=0.171, source="GHG Protocol", scope="Scope 1", is_demo=True),
            models.EmissionFactor(activity_type="Onsite Boilers", unit="kg", factor=2.85, source="EPA 2025", scope="Scope 1", is_demo=True),
            # Scope 2
            models.EmissionFactor(activity_type="Electricity (Grid)", unit="kWh", factor=0.420, source="IEA Grid Factor 2025", scope="Scope 2", is_demo=True),
            models.EmissionFactor(activity_type="Electricity (Grid)", unit="MWh", factor=420.0, source="IEA Grid Factor 2025", scope="Scope 2", is_demo=True),
            models.EmissionFactor(activity_type="Purchased Steam", unit="kWh", factor=0.170, source="DEFRA 2025", scope="Scope 2", is_demo=True),
            # Scope 3
            models.EmissionFactor(activity_type="Purchased Steel", unit="kg", factor=1.82, source="World Steel Assoc", scope="Scope 3", is_demo=True),
            models.EmissionFactor(activity_type="Purchased Aluminum", unit="kg", factor=8.90, source="IAI 2025", scope="Scope 3", is_demo=True),
            models.EmissionFactor(activity_type="Air Freight", unit="km", factor=0.620, source="ICAO 2025", scope="Scope 3", is_demo=True),
            models.EmissionFactor(activity_type="Road Freight", unit="km", factor=0.145, source="GLEC Framework", scope="Scope 3", is_demo=True),
            models.EmissionFactor(activity_type="Business Travel (Air)", unit="km", factor=0.150, source="DEFRA 2025", scope="Scope 3", is_demo=True),
            models.EmissionFactor(activity_type="Employee Commuting", unit="km", factor=0.125, source="DEFRA 2025", scope="Scope 3", is_demo=True),
            models.EmissionFactor(activity_type="Hazardous Waste Disposal", unit="kg", factor=0.450, source="EPA WARM", scope="Scope 3", is_demo=True),
        ]
        db.add_all(efs)
        db.commit()
        
        # 5. Seed 50+ Activities & calculate Emissions
        activity_templates = [
            ("Natural Gas", "kWh", "Scope 1", 25000, 180000, "SAP ERP"),
            ("Diesel Fuel", "litres", "Scope 1", 1200, 8500, "WMS Fleet Log"),
            ("Petrol Fuel", "litres", "Scope 1", 800, 4500, "Manual Expense"),
            ("Company Fleet", "km", "Scope 1", 3500, 24000, "IoT GPS Meter"),
            ("Electricity (Grid)", "kWh", "Scope 2", 85000, 420000, "Smart Meter IoT"),
            ("Purchased Steam", "kWh", "Scope 2", 15000, 95000, "MES Utility Meter"),
            ("Purchased Steel", "kg", "Scope 3", 10000, 85000, "SAP Procurement"),
            ("Purchased Aluminum", "kg", "Scope 3", 2500, 18000, "Oracle SCM"),
            ("Air Freight", "km", "Scope 3", 1500, 12000, "WMS Logistics"),
            ("Road Freight", "km", "Scope 3", 8000, 45000, "WMS Logistics"),
            ("Business Travel (Air)", "km", "Scope 3", 4000, 32000, "Concur Expense"),
            ("Employee Commuting", "km", "Scope 3", 6000, 48000, "HR Survey"),
            ("Hazardous Waste Disposal", "kg", "Scope 3", 1200, 9500, "Waste Manifest"),
        ]
        
        acts = []
        emissions = []
        periods = ["2026-Q1", "2025-Q4", "2025-Q3", "2025-Q2"]
        
        for i in range(54):
            template = activity_templates[i % len(activity_templates)]
            act_type, unit, scope, min_q, max_q, source = template
            fac = facilities[i % len(facilities)]
            period = periods[i % len(periods)]
            qty = float(random.randint(min_q, max_q))
            
            # Match emission factor
            factor_val = 0.42 if scope == "Scope 2" else (0.183 if "Gas" in act_type else 1.82)
            for ef in efs:
                if ef.activity_type == act_type and ef.unit == unit:
                    factor_val = ef.factor
                    break
                    
            co2e_kg = qty * factor_val
            co2e_t = round(co2e_kg / 1000.0, 2)
            
            act = models.Activity(
                facility_id=fac.id,
                activity_type=act_type,
                activity_name=f"{act_type} - Batch {i+1}",
                quantity=qty,
                unit=unit,
                scope=scope,
                source=source,
                status="Valid" if i % 10 != 0 else "Warning",
                period=period,
                activity_date=(datetime.now() - timedelta(days=i*4)).strftime("%Y-%m-%d"),
                notes=f"Automated ingestion record #{i+1}"
            )
            db.add(act)
            db.commit()
            db.refresh(act)
            
            em = models.Emission(
                activity_id=act.id,
                facility_id=fac.id,
                scope=scope,
                quantity=qty,
                unit=unit,
                emission_factor_value=factor_val,
                emission_factor_source="GHG Protocol / DEFRA Standard 2025",
                co2e_tonnes=co2e_t,
                period=period,
                date=act.activity_date
            )
            emissions.append(em)
            
        db.add_all(emissions)
        db.commit()
        
        # 6. Seed 10+ Suppliers
        suppliers_data = [
            ("ThyssenKrupp Steel Solutions", "SUP-001", "Raw Materials", "Germany", "Active", "Low", 94.5, 91.2, 4820.0, "esg@thyssenkrupp.de"),
            ("Hydro Aluminum International", "SUP-002", "Raw Materials", "Norway", "Active", "Low", 96.0, 89.5, 3210.0, "sustainability@hydro.com"),
            ("Apex Logistics Global", "SUP-003", "Logistics", "Netherlands", "Active", "Medium", 71.4, 68.0, 7230.0, "carbon@apexlogistics.nl"),
            ("SinoPower Component Corp", "SUP-004", "Electronics", "Taiwan", "Under Review", "High", 52.0, 43.5, 12430.0, "info@sinopower.tw"),
            ("Schneider Electric Components", "SUP-005", "Electrical", "France", "Active", "Low", 98.2, 95.0, 1850.0, "green@schneider.fr"),
            ("BASF Performance Polymers", "SUP-006", "Chemicals", "Germany", "Active", "Low", 91.0, 88.0, 5600.0, "sustainability@basf.com"),
            ("Brembo Brake Systems", "SUP-007", "Components", "Italy", "Active", "Medium", 78.5, 74.0, 3900.0, "esg@brembo.it"),
            ("Nippon Steel Corp", "SUP-008", "Raw Materials", "Japan", "Active", "Medium", 80.0, 76.5, 8900.0, "co2@nipponsteel.jp"),
            ("DHL Supply Chain Solutions", "SUP-009", "Logistics", "Germany", "Active", "Low", 95.0, 92.0, 4100.0, "go_green@dhl.com"),
            ("Delta Electronics Inc", "SUP-010", "Electronics", "Taiwan", "Active", "Low", 92.0, 87.5, 2950.0, "esg@deltaww.com"),
        ]
        
        supp_objs = []
        for name, code, cat, ctry, st, risk, dq, sus, ems, email in suppliers_data:
            s = models.Supplier(
                name=name, code=code, category=cat, country=ctry, status=st,
                risk_level=risk, data_quality_score=dq, sustainability_score=sus,
                total_emissions_tco2e=ems, contact_email=email
            )
            db.add(s)
            db.commit()
            db.refresh(s)
            supp_objs.append(s)
            
            # Add questionnaire & scorecard
            q = models.SupplierQuestionnaire(
                supplier_id=s.id,
                title="2026 Scope 1-3 ESG & Science-Based Target Disclosure",
                status="Completed",
                score=sus,
                target_year=2030,
                net_zero_commitment=(risk == "Low"),
                renewable_pct=65.0 if risk == "Low" else 20.0
            )
            db.add(q)
            
            card = models.SupplierScorecard(
                supplier_id=s.id,
                period="2026-Q1",
                carbon_score=sus,
                data_quality_score=dq,
                governance_score=85.0 if risk == "Low" else 55.0,
                total_score=sus,
                grade="A+" if sus > 90 else ("A" if sus > 80 else ("B" if sus > 70 else "C"))
            )
            db.add(card)
            
            plan = models.ActionPlan(
                supplier_id=s.id,
                title="Green Energy Transition & Raw Material Low-Carbon Certification",
                description="Increase renewable electricity procurement to 80% and submit verified EPDs for steel/aluminum products.",
                target_date="2026-12-31",
                status="In Progress",
                progress_pct=45.0
            )
            db.add(plan)
            
        db.commit()
        
        # 7. Seed 5+ Products with LCA & PCF
        products_data = [
            ("Industrial Pump X200", "SKU-PUMP-X200", "Heavy Industrial Equipment", "unit", 1200, 128.4),
            ("High-Efficiency Electric Motor E5", "SKU-MOT-E500", "Electrical Drive Systems", "unit", 3500, 84.2),
            ("Automotive Transmission Module T9", "SKU-TRN-T900", "Automotive Assemblies", "unit", 2800, 215.6),
            ("Smart Sensor Control Module S-1", "SKU-SNS-S100", "Electronics", "unit", 15000, 18.5),
            ("Aluminum Heavy Chassis Frame C-4", "SKU-CHS-C400", "Structural Steel & Metal", "unit", 800, 480.0),
        ]
        
        for name, sku, cat, un, vol, pcf_val in products_data:
            p = models.Product(name=name, sku=sku, category=cat, unit=un, annual_volume=vol, pcf_kgco2e=pcf_val)
            db.add(p)
            db.commit()
            db.refresh(p)
            
            # Materials
            m1 = models.ProductMaterial(product_id=p.id, material_name="Primary Recycled Steel", quantity=45.0, unit="kg", emission_factor=1.82, stage="Raw Material", co2e_kg=round(45.0*1.82, 2))
            m2 = models.ProductMaterial(product_id=p.id, material_name="Virgin Aluminum Alloy", quantity=12.0, unit="kg", emission_factor=8.90, stage="Raw Material", co2e_kg=round(12.0*8.90, 2))
            m3 = models.ProductMaterial(product_id=p.id, material_name="Copper Wire & Windings", quantity=5.0, unit="kg", emission_factor=3.45, stage="Raw Material", co2e_kg=round(5.0*3.45, 2))
            db.add_all([m1, m2, m3])
            
            # LCA processes
            l1 = models.LCAProcess(product_id=p.id, stage="Manufacturing", process_name="CNC Machining & Precision Milling", energy_kwh=65.0, co2e_kg=round(65.0*0.42, 2))
            l2 = models.LCAProcess(product_id=p.id, stage="Transportation", process_name="Euro-6 Diesel Freight to Customer Site", transport_tkm=450.0, co2e_kg=round(450.0*0.05, 2))
            l3 = models.LCAProcess(product_id=p.id, stage="Packaging", process_name="Corrugated Recyclable Cardboard Crating", energy_kwh=12.0, co2e_kg=8.5)
            l4 = models.LCAProcess(product_id=p.id, stage="Use Phase", process_name="10,000 Hours Operational Lifetime Power Draw", energy_kwh=120.0, co2e_kg=18.0)
            l5 = models.LCAProcess(product_id=p.id, stage="End of Life", process_name="Recycling & Material Recovery (90% Yield)", energy_kwh=5.0, co2e_kg=4.2)
            db.add_all([l1, l2, l3, l4, l5])
            
            # PCF Result
            pcf_res = models.PCFResult(
                product_id=p.id,
                raw_materials_co2e=round(pcf_val * 0.42, 2),
                manufacturing_co2e=round(pcf_val * 0.21, 2),
                transport_co2e=round(pcf_val * 0.12, 2),
                packaging_co2e=round(pcf_val * 0.06, 2),
                use_phase_co2e=round(pcf_val * 0.15, 2),
                end_of_life_co2e=round(pcf_val * 0.04, 2),
                total_pcf_kgco2e=pcf_val
            )
            db.add(pcf_res)
            db.commit()

        # 8. Reduction Targets
        target = models.ReductionTarget(
            name="2030 Science-Based Corporate Decarbonization Target",
            scope_coverage="Scope 1, 2 & 3",
            baseline_year=2023,
            baseline_emissions_tco2e=42680.0,
            target_year=2030,
            target_emissions_tco2e=30000.0,
            reduction_pct=29.7,
            current_emissions_tco2e=38950.0,
            status="On Track"
        )
        db.add(target)
        db.commit()

        # 9. Scenarios
        scen1 = models.Scenario(
            name="2030 Aggressive Renewable Transition",
            description="100% Onsite Solar + VPPA procurement across all European and US manufacturing plants.",
            renewable_energy_pct=85.0,
            transport_reduction_pct=30.0,
            material_efficiency_pct=20.0,
            supplier_improvement_pct=40.0,
            energy_efficiency_pct=25.0,
            baseline_emissions_tco2e=42680.0,
            projected_emissions_tco2e=26400.0,
            reduction_tco2e=16280.0,
            reduction_pct=38.1
        )
        scen2 = models.Scenario(
            name="Fleet Electrification & Supply Chain ESG Mandate",
            description="Full transition of commercial vehicle fleet to EV and mandatory Tier-1 low-carbon steel requirement.",
            renewable_energy_pct=40.0,
            transport_reduction_pct=60.0,
            material_efficiency_pct=35.0,
            supplier_improvement_pct=50.0,
            energy_efficiency_pct=15.0,
            baseline_emissions_tco2e=42680.0,
            projected_emissions_tco2e=29800.0,
            reduction_tco2e=12880.0,
            reduction_pct=30.2
        )
        db.add_all([scen1, scen2])
        db.commit()

        # 10. Reduction Projects
        projects = [
            models.ReductionProject(name="Plant A Rooftop Solar PV Installation (4.2 MWp)", category="Renewable Energy", facility_id=fac1.id, investment_amount=1850000.0, expected_reduction_tco2e=4200.0, actual_reduction_tco2e=3800.0, start_date="2024-03-01", target_date="2025-06-30", status="Active", owner="Hans Gruber (Energy Mgr)", roi_pct=16.8, cost_per_tonne=440.48),
            models.ReductionProject(name="Commercial Fleet Electrification (50 Heavy EVs)", category="Electrification", facility_id=fac4.id, investment_amount=3200000.0, expected_reduction_tco2e=2800.0, actual_reduction_tco2e=1900.0, start_date="2024-09-15", target_date="2026-12-31", status="Active", owner="Marco Rossi (Logistics Director)", roi_pct=14.2, cost_per_tonne=1142.85),
            models.ReductionProject(name="Plant B Heat Recovery & Boiler Retrofit", category="Energy Efficiency", facility_id=fac2.id, investment_amount=650000.0, expected_reduction_tco2e=1450.0, actual_reduction_tco2e=1400.0, start_date="2025-01-10", target_date="2025-11-30", status="Completed", owner="Sarah Jenkins (Plant Mgr)", roi_pct=22.4, cost_per_tonne=448.27),
            models.ReductionProject(name="Supplier Green Power Co-Procurement Program", category="Supply Chain", facility_id=fac3.id, investment_amount=400000.0, expected_reduction_tco2e=5200.0, actual_reduction_tco2e=2100.0, start_date="2025-04-01", target_date="2027-03-31", status="Active", owner="Chen Wei (Supply Chain VP)", roi_pct=28.5, cost_per_tonne=76.92),
        ]
        db.add_all(projects)
        db.commit()

        # 11. Integrations / Demo Adapters
        integrations = [
            models.Integration(system_name="SAP ERP (S/4HANA)", category="ERP System", status="DEMO CONNECTED", last_sync="2026-09-03 08:30:00", records_imported=1245, sync_frequency="Hourly Automated Sync", details="Connected via simulated RFC/REST adapter with mock activity streams."),
            models.Integration(system_name="Oracle SCM Cloud", category="Supply Chain", status="DEMO CONNECTED", last_sync="2026-09-03 07:15:00", records_imported=890, sync_frequency="Daily Batch", details="Syncing Tier-1 supplier shipment manifests and weight logs."),
            models.Integration(system_name="Microsoft Dynamics 365", category="ERP System", status="DEMO CONNECTED", last_sync="2026-09-02 22:00:00", records_imported=450, sync_frequency="Daily Batch", details="Corporate travel expense and fleet fuel log ingestion."),
            models.Integration(system_name="Smart IoT Meters (Modbus/MQTT)", category="IoT / Telemetry", status="DEMO CONNECTED", last_sync="2026-09-03 09:12:00", records_imported=4580, sync_frequency="Real-time / 5-min intervals", details="Sub-metering energy telemetry across Plant A, B and C assembly floors."),
            models.Integration(system_name="Siemens Opcenter MES", category="Manufacturing Execution", status="DEMO CONNECTED", last_sync="2026-09-03 06:45:00", records_imported=670, sync_frequency="Hourly Sync", details="Production line energy draw per unit manufactured."),
            models.Integration(system_name="Windchill PLM", category="Product Lifecycle", status="DEMO CONNECTED", last_sync="2026-09-01 14:00:00", records_imported=120, sync_frequency="On-Demand", details="Bill of Materials (BOM) material weights for Product Carbon Footprint."),
            models.Integration(system_name="DecarbX Supplier Portal", category="Supplier Network", status="DEMO CONNECTED", last_sync="2026-09-03 09:00:00", records_imported=85, sync_frequency="Real-time Webhook", details="Direct supplier ESG questionnaires and third-party ISO verification uploads.")
        ]
        db.add_all(integrations)
        db.commit()

        # 12. Evidence Records
        evidence_docs = [
            models.Evidence(document_name="Plant A Electricity Invoice 2026-Q1.pdf", category="Utility Invoice", file_path="/docs/evidence/inv_plant_a_q1.pdf", uploaded_date="2026-02-01", reporting_period="2026-Q1", status="Verified", notes="Third-party utility statement confirming 420,000 kWh consumption."),
            models.Evidence(document_name="Natural Gas Meter Reading & Billing Statement.pdf", category="Utility Invoice", file_path="/docs/evidence/gas_plant_b.pdf", uploaded_date="2026-02-05", reporting_period="2026-Q1", status="Verified", notes="Verified by internal energy manager."),
            models.Evidence(document_name="ThyssenKrupp EPD Certificate (Low-Carbon Steel).pdf", category="Audit Certificate", file_path="/docs/evidence/epd_steel_2025.pdf", uploaded_date="2026-01-15", reporting_period="2025-YTD", status="Verified", notes="Environmental Product Declaration ISO 14025 compliant."),
            models.Evidence(document_name="Commercial Logistics Fleet Diesel Fuel Logs.xlsx", category="Fuel Log", file_path="/docs/evidence/fleet_fuel_jan.xlsx", uploaded_date="2026-02-10", reporting_period="2026-Q1", status="Pending Review", notes="Under audit review by sustainability team.")
        ]
        db.add_all(evidence_docs)
        db.commit()

        # 13. Carbon Budgets
        budgets = [
            models.CarbonBudget(facility_id=fac1.id, year=2026, allocated_tco2e=14000.0, spent_tco2e=3250.0, remaining_tco2e=10750.0, budget_amount=1200000.0, spent_amount=280000.0),
            models.CarbonBudget(facility_id=fac2.id, year=2026, allocated_tco2e=12000.0, spent_tco2e=2900.0, remaining_tco2e=9100.0, budget_amount=950000.0, spent_amount=210000.0),
            models.CarbonBudget(facility_id=fac3.id, year=2026, allocated_tco2e=9000.0, spent_tco2e=2100.0, remaining_tco2e=6900.0, budget_amount=750000.0, spent_amount=160000.0),
            models.CarbonBudget(facility_id=fac4.id, year=2026, allocated_tco2e=8000.0, spent_tco2e=1950.0, remaining_tco2e=6050.0, budget_amount=600000.0, spent_amount=135000.0),
        ]
        db.add_all(budgets)
        db.commit()

        # 14. Initial Audit Logs
        audits = [
            models.AuditLog(user="System Administrator", action="Database Seeded", entity="System", description="Initialized DecarbX platform database with baseline enterprise seed topology."),
            models.AuditLog(user="Carbon Engine Service", action="Emissions Calculated", entity="Emission", description="Calculated initial 54 activity records across Scope 1, Scope 2, and Scope 3."),
            models.AuditLog(user="Integration Adapter Service", action="Adapters Initialized", entity="Integration", description="Initialized 7 demo enterprise adapters (SAP, Oracle, Smart Meters, MES)."),
            models.AuditLog(user="ESG Lead", action="Target Configured", entity="ReductionTarget", description="Set 2030 Science-Based Target (29.7% reduction vs 2023 baseline).")
        ]
        db.add_all(audits)
        db.commit()

        print("DecarbX database successfully seeded with realistic enterprise data!")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
