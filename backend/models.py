from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Organization(Base):
    __tablename__ = "organizations"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    code = Column(String, unique=True, index=True)
    industry = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    facilities = relationship("Facility", back_populates="organization")

class Facility(Base):
    __tablename__ = "facilities"
    id = Column(Integer, primary_key=True, index=True)
    org_id = Column(Integer, ForeignKey("organizations.id"))
    name = Column(String, nullable=False)
    facility_type = Column(String)
    location = Column(String)
    country = Column(String)
    square_meters = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    organization = relationship("Organization", back_populates="facilities")
    activities = relationship("Activity", back_populates="facility")
    emissions = relationship("Emission", back_populates="facility")
    projects = relationship("ReductionProject", back_populates="facility")
    budgets = relationship("CarbonBudget", back_populates="facility")

class Department(Base):
    __tablename__ = "departments"
    id = Column(Integer, primary_key=True, index=True)
    facility_id = Column(Integer, ForeignKey("facilities.id"))
    name = Column(String, nullable=False)
    code = Column(String)

class Activity(Base):
    __tablename__ = "activities"
    id = Column(Integer, primary_key=True, index=True)
    facility_id = Column(Integer, ForeignKey("facilities.id"))
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    activity_type = Column(String, nullable=False) # e.g. Natural Gas, Electricity, Diesel, Business Travel
    activity_name = Column(String)
    quantity = Column(Float, nullable=False)
    unit = Column(String, nullable=False) # kWh, litres, kg, tonnes, km, MWh, pkm
    scope = Column(String, nullable=False) # Scope 1, Scope 2, Scope 3
    source = Column(String, default="Manual") # ERP, CSV, IoT Meter, Manual
    status = Column(String, default="Valid") # Valid, Warning, Rejected
    period = Column(String, nullable=False) # e.g., 2026-Q1, 2026-01
    activity_date = Column(String)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    facility = relationship("Facility", back_populates="activities")
    emissions = relationship("Emission", back_populates="activity", uselist=False)

class EmissionFactor(Base):
    __tablename__ = "emission_factors"
    id = Column(Integer, primary_key=True, index=True)
    activity_type = Column(String, nullable=False, index=True)
    unit = Column(String, nullable=False)
    factor = Column(Float, nullable=False) # kgCO2e per unit
    source = Column(String, nullable=False) # DEFRA, EPA, Ecoinvent, IEA
    region = Column(String, default="Global")
    year = Column(Integer, default=2025)
    scope = Column(String, nullable=False)
    methodology = Column(String, default="GHG Protocol Standard")
    is_demo = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Emission(Base):
    __tablename__ = "emissions"
    id = Column(Integer, primary_key=True, index=True)
    activity_id = Column(Integer, ForeignKey("activities.id"))
    facility_id = Column(Integer, ForeignKey("facilities.id"))
    scope = Column(String, nullable=False)
    quantity = Column(Float, nullable=False)
    unit = Column(String, nullable=False)
    emission_factor_value = Column(Float, nullable=False)
    emission_factor_source = Column(String)
    co2e_tonnes = Column(Float, nullable=False)
    period = Column(String, nullable=False)
    date = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    activity = relationship("Activity", back_populates="emissions")
    facility = relationship("Facility", back_populates="emissions")

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    sku = Column(String, unique=True, index=True)
    category = Column(String)
    unit = Column(String, default="unit")
    annual_volume = Column(Float, default=1000)
    pcf_kgco2e = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    materials = relationship("ProductMaterial", back_populates="product")
    lca_processes = relationship("LCAProcess", back_populates="product")
    pcf_results = relationship("PCFResult", back_populates="product")

class ProductMaterial(Base):
    __tablename__ = "product_materials"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    material_name = Column(String, nullable=False)
    quantity = Column(Float, nullable=False)
    unit = Column(String, nullable=False)
    emission_factor = Column(Float, nullable=False) # kgCO2e/unit
    stage = Column(String, default="Raw Material")
    co2e_kg = Column(Float, nullable=False)

    product = relationship("Product", back_populates="materials")

class LCAProcess(Base):
    __tablename__ = "lca_processes"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    stage = Column(String, nullable=False) # Raw Material, Manufacturing, Transportation, Use Phase, End of Life
    process_name = Column(String, nullable=False)
    energy_kwh = Column(Float, default=0.0)
    fuel_litres = Column(Float, default=0.0)
    transport_tkm = Column(Float, default=0.0)
    co2e_kg = Column(Float, nullable=False)

    product = relationship("Product", back_populates="lca_processes")

class PCFResult(Base):
    __tablename__ = "pcf_results"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    raw_materials_co2e = Column(Float, default=0.0)
    manufacturing_co2e = Column(Float, default=0.0)
    transport_co2e = Column(Float, default=0.0)
    packaging_co2e = Column(Float, default=0.0)
    use_phase_co2e = Column(Float, default=0.0)
    end_of_life_co2e = Column(Float, default=0.0)
    total_pcf_kgco2e = Column(Float, nullable=False)
    calculated_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product", back_populates="pcf_results")

class Supplier(Base):
    __tablename__ = "suppliers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    code = Column(String, unique=True, index=True)
    category = Column(String)
    country = Column(String)
    status = Column(String, default="Active") # Active, Under Review, High Risk
    risk_level = Column(String, default="Low") # Low, Medium, High
    data_quality_score = Column(Float, default=85.0) # %
    sustainability_score = Column(Float, default=80.0) # /100
    total_emissions_tco2e = Column(Float, default=0.0)
    contact_email = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    questionnaires = relationship("SupplierQuestionnaire", back_populates="supplier")
    scorecards = relationship("SupplierScorecard", back_populates="supplier")
    action_plans = relationship("ActionPlan", back_populates="supplier")

class SupplierQuestionnaire(Base):
    __tablename__ = "supplier_questionnaires"
    id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))
    title = Column(String, nullable=False)
    status = Column(String, default="Completed") # Draft, Sent, Completed, Verified
    score = Column(Float, default=75.0)
    target_year = Column(Integer, default=2030)
    net_zero_commitment = Column(Boolean, default=False)
    renewable_pct = Column(Float, default=0.0)
    submitted_at = Column(DateTime, default=datetime.utcnow)

    supplier = relationship("Supplier", back_populates="questionnaires")
    responses = relationship("SupplierResponse", back_populates="questionnaire")

class SupplierResponse(Base):
    __tablename__ = "supplier_responses"
    id = Column(Integer, primary_key=True, index=True)
    questionnaire_id = Column(Integer, ForeignKey("supplier_questionnaires.id"))
    question = Column(String, nullable=False)
    answer = Column(String, nullable=False)
    evidence_ref = Column(String, nullable=True)
    verified = Column(Boolean, default=True)

    questionnaire = relationship("SupplierQuestionnaire", back_populates="responses")

class SupplierScorecard(Base):
    __tablename__ = "supplier_scorecards"
    id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))
    period = Column(String, nullable=False)
    carbon_score = Column(Float, default=80.0)
    data_quality_score = Column(Float, default=85.0)
    governance_score = Column(Float, default=75.0)
    total_score = Column(Float, default=80.0)
    grade = Column(String, default="A-") # A+, A, B, C, D
    evaluated_at = Column(DateTime, default=datetime.utcnow)

    supplier = relationship("Supplier", back_populates="scorecards")

class ActionPlan(Base):
    __tablename__ = "action_plans"
    id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))
    title = Column(String, nullable=False)
    description = Column(Text)
    target_date = Column(String)
    status = Column(String, default="In Progress") # Planned, In Progress, Completed
    progress_pct = Column(Float, default=0.0)

    supplier = relationship("Supplier", back_populates="action_plans")

class ReductionTarget(Base):
    __tablename__ = "reduction_targets"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    scope_coverage = Column(String, default="Scope 1, 2 & 3")
    baseline_year = Column(Integer, default=2023)
    baseline_emissions_tco2e = Column(Float, nullable=False)
    target_year = Column(Integer, default=2030)
    target_emissions_tco2e = Column(Float, nullable=False)
    reduction_pct = Column(Float, nullable=False)
    current_emissions_tco2e = Column(Float, nullable=False)
    status = Column(String, default="On Track") # On Track, At Risk, Ahead

class Scenario(Base):
    __tablename__ = "scenarios"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    renewable_energy_pct = Column(Float, default=0.0)
    transport_reduction_pct = Column(Float, default=0.0)
    material_efficiency_pct = Column(Float, default=0.0)
    supplier_improvement_pct = Column(Float, default=0.0)
    energy_efficiency_pct = Column(Float, default=0.0)
    baseline_emissions_tco2e = Column(Float, nullable=False)
    projected_emissions_tco2e = Column(Float, nullable=False)
    reduction_tco2e = Column(Float, nullable=False)
    reduction_pct = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class ReductionProject(Base):
    __tablename__ = "reduction_projects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False) # Renewable, Energy Efficiency, Electrification, Supply Chain
    facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=True)
    investment_amount = Column(Float, nullable=False) # in local currency / USD / INR
    expected_reduction_tco2e = Column(Float, nullable=False)
    actual_reduction_tco2e = Column(Float, default=0.0)
    start_date = Column(String)
    target_date = Column(String)
    status = Column(String, default="Active") # Planned, Active, Completed, Cancelled
    owner = Column(String)
    roi_pct = Column(Float, default=0.0)
    cost_per_tonne = Column(Float, default=0.0)

    facility = relationship("Facility", back_populates="projects")

class Integration(Base):
    __tablename__ = "integrations"
    id = Column(Integer, primary_key=True, index=True)
    system_name = Column(String, nullable=False) # SAP ERP, Oracle SCM, MS Dynamics, Smart Meters
    category = Column(String) # ERP, PLM, MES, WMS, IoT, Supplier Portal
    status = Column(String, default="DEMO CONNECTED") # DEMO CONNECTED, Disconnected, Syncing, Error
    last_sync = Column(String)
    records_imported = Column(Integer, default=0)
    sync_frequency = Column(String, default="Real-time / Hourly")
    details = Column(String)

class Evidence(Base):
    __tablename__ = "evidence"
    id = Column(Integer, primary_key=True, index=True)
    document_name = Column(String, nullable=False)
    category = Column(String, nullable=False) # Utility Invoice, Fuel Log, Declaration, Audit Certificate
    file_path = Column(String)
    uploaded_date = Column(String)
    activity_id = Column(Integer, ForeignKey("activities.id"), nullable=True)
    reporting_period = Column(String)
    status = Column(String, default="Verified") # Pending Review, Verified, Rejected
    notes = Column(Text, nullable=True)

class ComplianceReport(Base):
    __tablename__ = "compliance_reports"
    id = Column(Integer, primary_key=True, index=True)
    framework_name = Column(String, nullable=False) # GHG Protocol, CSRD, CDP, BRSR, TCFD
    reporting_period = Column(String, nullable=False)
    status = Column(String, default="READY") # READY, IN PROGRESS, SUBMITTED
    scope1_completeness = Column(Float, default=100.0) # %
    scope2_completeness = Column(Float, default=100.0)
    scope3_completeness = Column(Float, default=85.0)
    csrd_readiness_score = Column(Float, default=92.0)
    generated_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    user = Column(String, default="System Administrator")
    action = Column(String, nullable=False) # Activity Imported, Emission Calculated, Scenario Saved
    entity = Column(String, nullable=False) # Activity, Scenario, Supplier, Integration
    description = Column(Text, nullable=False)

class CarbonBudget(Base):
    __tablename__ = "carbon_budgets"
    id = Column(Integer, primary_key=True, index=True)
    facility_id = Column(Integer, ForeignKey("facilities.id"))
    year = Column(Integer, default=2026)
    allocated_tco2e = Column(Float, nullable=False)
    spent_tco2e = Column(Float, default=0.0)
    remaining_tco2e = Column(Float, nullable=False)
    budget_amount = Column(Float, default=0.0) # $ / INR
    spent_amount = Column(Float, default=0.0)

    facility = relationship("Facility", back_populates="budgets")
