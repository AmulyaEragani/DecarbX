export interface Activity {
  id: number;
  facility_id: number;
  department_id?: number;
  activity_type: string;
  activity_name: string;
  quantity: number;
  unit: string;
  scope: string;
  source: string;
  status: string;
  period: string;
  activity_date?: string;
  notes?: string;
  created_at: string;
}

export interface Emission {
  id: number;
  activity_id: number;
  facility_id: number;
  scope: string;
  quantity: number;
  unit: string;
  emission_factor_value: number;
  emission_factor_source: string;
  co2e_tonnes: number;
  period: string;
  date?: string;
  created_at: string;
}

export interface EmissionFactor {
  id: number;
  activity_type: string;
  unit: string;
  factor: number;
  source: string;
  region: string;
  year: number;
  scope: string;
  methodology: string;
  is_demo: boolean;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  unit: string;
  annual_volume: number;
  pcf_kgco2e: number;
}

export interface PCFDetails {
  total_pcf_kgco2e: number;
  raw_materials_co2e: number;
  manufacturing_co2e: number;
  transport_co2e: number;
  packaging_co2e: number;
  use_phase_co2e: number;
  end_of_life_co2e: number;
}

export interface Supplier {
  id: number;
  name: string;
  code: string;
  category: string;
  country: string;
  status: string;
  risk_level: 'Low' | 'Medium' | 'High';
  data_quality_score: number;
  sustainability_score: number;
  total_emissions_tco2e: number;
  contact_email?: string;
  grade?: string;
}

export interface SupplierScorecard {
  id: number;
  supplier_id: number;
  period: string;
  carbon_score: number;
  data_quality_score: number;
  governance_score: number;
  total_score: number;
  grade: string;
  evaluated_at: string;
}

export interface ActionPlan {
  id: number;
  supplier_id: number;
  title: string;
  description: string;
  target_date: string;
  status: string;
  progress_pct: number;
}

export interface AIInsight {
  id: string;
  category: string;
  title: string;
  impact: string;
  explanation: string;
}

export interface Anomaly {
  id: string;
  facility: string;
  title: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  recommendation: string;
}

export interface Recommendation {
  id: string;
  title: string;
  category: string;
  estimated_reduction_tco2e: number;
  estimated_cost_savings: string;
  payback_years: string;
  difficulty: string;
  why: string;
}

export interface Scenario {
  id: number;
  name: string;
  description: string;
  renewable_energy_pct: number;
  transport_reduction_pct: number;
  material_efficiency_pct: number;
  supplier_improvement_pct: number;
  energy_efficiency_pct: number;
  baseline_emissions_tco2e: number;
  projected_emissions_tco2e: number;
  reduction_tco2e: number;
  reduction_pct: number;
  created_at?: string;
}

export interface ReductionTarget {
  id: number;
  name: string;
  scope_coverage: string;
  baseline_year: number;
  baseline_emissions_tco2e: number;
  target_year: number;
  target_emissions_tco2e: number;
  reduction_pct: number;
  current_emissions_tco2e: number;
  status: string;
}

export interface ReductionProject {
  id: number;
  name: string;
  category: string;
  facility_id?: number;
  investment_amount: number;
  expected_reduction_tco2e: number;
  actual_reduction_tco2e: number;
  start_date: string;
  target_date: string;
  status: string;
  owner: string;
  roi_pct: number;
  cost_per_tonne: number;
}

export interface Integration {
  id: number;
  system_name: string;
  category: string;
  status: string;
  last_sync: string;
  records_imported: number;
  sync_frequency: string;
  details: string;
}

export interface Evidence {
  id: number;
  document_name: string;
  category: string;
  file_path: string;
  uploaded_date: string;
  reporting_period: string;
  status: string;
  notes?: string;
}

export interface ComplianceFramework {
  id: string;
  name: string;
  status: string;
  readiness_pct: number;
  scope1: string;
  scope2: string;
  scope3: string;
  assurance_status: string;
  notes: string;
}

export interface CarbonBudget {
  id: number;
  facility_id: number;
  year: number;
  allocated_tco2e: number;
  spent_tco2e: number;
  remaining_tco2e: number;
  budget_amount: number;
  spent_amount: number;
}

export interface AuditLog {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  entity: string;
  description: string;
}

export interface DashboardData {
  metrics: {
    total_emissions_tco2e: number;
    scope1_tco2e: number;
    scope2_tco2e: number;
    scope3_tco2e: number;
    emission_intensity: number;
    target_progress_pct: number;
    data_quality_score: number;
  };
  target_summary: {
    name: string;
    baseline_tco2e: number;
    target_tco2e: number;
    current_tco2e: number;
    reduction_pct: number;
    status: string;
  };
  charts: {
    monthly_trend: Array<{ month: string; scope1: number; scope2: number; scope3: number; total: number }>;
    facility_breakdown: Array<{ name: string; emissions_tco2e: number; sqm: number; intensity: number }>;
    source_breakdown: Array<{ name: string; tco2e: number; scope: string }>;
    scope3_categories: Array<{ category: string; tco2e: number }>;
    scope_pie: Array<{ name: string; value: number }>;
  };
  recent_activities: Array<any>;
  recent_audits: Array<any>;
}
