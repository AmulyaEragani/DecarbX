from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ActivityBase(BaseModel):
    facility_id: int
    department_id: Optional[int] = None
    activity_type: str
    activity_name: Optional[str] = None
    quantity: float
    unit: str
    scope: str
    source: Optional[str] = "Manual"
    period: str
    activity_date: Optional[str] = None
    notes: Optional[str] = None

class ActivityCreate(ActivityBase):
    pass

class ActivityResponse(ActivityBase):
    id: int
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

class EmissionResponse(BaseModel):
    id: int
    activity_id: int
    facility_id: int
    scope: str
    quantity: float
    unit: str
    emission_factor_value: float
    emission_factor_source: Optional[str] = None
    co2e_tonnes: float
    period: str
    date: Optional[str] = None
    created_at: datetime
    class Config:
        from_attributes = True

class EmissionFactorBase(BaseModel):
    activity_type: str
    unit: str
    factor: float
    source: str
    region: str = "Global"
    year: int = 2025
    scope: str
    methodology: str = "GHG Protocol Standard"
    is_demo: bool = True

class EmissionFactorCreate(EmissionFactorBase):
    pass

class EmissionFactorResponse(EmissionFactorBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class ScenarioSimulateRequest(BaseModel):
    renewable_energy_pct: float = Field(0.0, ge=0.0, le=100.0)
    transport_reduction_pct: float = Field(0.0, ge=0.0, le=100.0)
    material_efficiency_pct: float = Field(0.0, ge=0.0, le=100.0)
    supplier_improvement_pct: float = Field(0.0, ge=0.0, le=100.0)
    energy_efficiency_pct: float = Field(0.0, ge=0.0, le=100.0)

class ScenarioCreate(ScenarioSimulateRequest):
    name: str
    description: Optional[str] = None

class ProductCreate(BaseModel):
    name: str
    sku: str
    category: str
    unit: str = "unit"
    annual_volume: float = 1000.0

class PCFCalculateRequest(BaseModel):
    product_id: int
    raw_materials_co2e: float
    manufacturing_co2e: float
    transport_co2e: float
    packaging_co2e: float
    use_phase_co2e: float
    end_of_life_co2e: float

class IntegrationSyncRequest(BaseModel):
    system_name: str
