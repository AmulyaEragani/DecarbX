from sqlalchemy.orm import Session
from models import Emission, Scenario, AuditLog
from typing import Dict, Any

def simulate_decarbonization_scenario(
    db: Session,
    renewable_energy_pct: float,
    transport_reduction_pct: float,
    material_efficiency_pct: float,
    supplier_improvement_pct: float,
    energy_efficiency_pct: float
) -> Dict[str, Any]:
    emissions = db.query(Emission).all()
    
    scope1_baseline = sum(e.co2e_tonnes for e in emissions if e.scope == "Scope 1") or 12450.0
    scope2_baseline = sum(e.co2e_tonnes for e in emissions if e.scope == "Scope 2") or 15820.0
    scope3_baseline = sum(e.co2e_tonnes for e in emissions if e.scope == "Scope 3") or 14410.0
    
    total_baseline = scope1_baseline + scope2_baseline + scope3_baseline
    
    # Reductions:
    # Scope 1: Energy efficiency applies to thermal; transport reduction applies to fleet
    scope1_red_pct = (energy_efficiency_pct * 0.5) + (transport_reduction_pct * 0.5)
    scope1_proj = scope1_baseline * (1.0 - (scope1_red_pct / 100.0))
    
    # Scope 2: Renewable energy adoption directly reduces Scope 2 + Energy Efficiency
    scope2_red_pct = min(100.0, renewable_energy_pct + (energy_efficiency_pct * 0.3))
    scope2_proj = scope2_baseline * (1.0 - (scope2_red_pct / 100.0))
    
    # Scope 3: Material efficiency + Supplier improvement + Transport reduction
    scope3_red_pct = (material_efficiency_pct * 0.4) + (supplier_improvement_pct * 0.4) + (transport_reduction_pct * 0.2)
    scope3_proj = scope3_baseline * (1.0 - (scope3_red_pct / 100.0))
    
    total_proj = round(scope1_proj + scope2_proj + scope3_proj, 1)
    abs_reduction = round(total_baseline - total_proj, 1)
    pct_reduction = round((abs_reduction / max(total_baseline, 1.0)) * 100.0, 1)
    
    return {
        "baseline_emissions_tco2e": round(total_baseline, 1),
        "projected_emissions_tco2e": total_proj,
        "reduction_tco2e": abs_reduction,
        "reduction_pct": pct_reduction,
        "breakdown": {
            "scope1": {
                "baseline": round(scope1_baseline, 1),
                "projected": round(scope1_proj, 1),
                "reduction": round(scope1_baseline - scope1_proj, 1)
            },
            "scope2": {
                "baseline": round(scope2_baseline, 1),
                "projected": round(scope2_proj, 1),
                "reduction": round(scope2_baseline - scope2_proj, 1)
            },
            "scope3": {
                "baseline": round(scope3_baseline, 1),
                "projected": round(scope3_proj, 1),
                "reduction": round(scope3_baseline - scope3_proj, 1)
            }
        },
        "parameters": {
            "renewable_energy_pct": renewable_energy_pct,
            "transport_reduction_pct": transport_reduction_pct,
            "material_efficiency_pct": material_efficiency_pct,
            "supplier_improvement_pct": supplier_improvement_pct,
            "energy_efficiency_pct": energy_efficiency_pct
        }
    }

def save_scenario(
    db: Session,
    name: str,
    description: str,
    renewable_energy_pct: float,
    transport_reduction_pct: float,
    material_efficiency_pct: float,
    supplier_improvement_pct: float,
    energy_efficiency_pct: float
) -> Scenario:
    sim_res = simulate_decarbonization_scenario(
        db, renewable_energy_pct, transport_reduction_pct,
        material_efficiency_pct, supplier_improvement_pct, energy_efficiency_pct
    )
    
    scenario = Scenario(
        name=name,
        description=description,
        renewable_energy_pct=renewable_energy_pct,
        transport_reduction_pct=transport_reduction_pct,
        material_efficiency_pct=material_efficiency_pct,
        supplier_improvement_pct=supplier_improvement_pct,
        energy_efficiency_pct=energy_efficiency_pct,
        baseline_emissions_tco2e=sim_res["baseline_emissions_tco2e"],
        projected_emissions_tco2e=sim_res["projected_emissions_tco2e"],
        reduction_tco2e=sim_res["reduction_tco2e"],
        reduction_pct=sim_res["reduction_pct"]
    )
    db.add(scenario)
    db.commit()
    db.refresh(scenario)
    
    audit = AuditLog(
        user="Sustainability Architect",
        action="Scenario Created",
        entity="Scenario",
        description=f"Saved decarbonization scenario '{name}' ({sim_res['reduction_pct']}% projected reduction)"
    )
    db.add(audit)
    db.commit()
    
    return scenario
