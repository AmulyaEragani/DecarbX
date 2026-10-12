from sqlalchemy.orm import Session
from models import CarbonBudget, ReductionProject, Facility
from typing import Dict, Any, List

def get_carbon_finance_summary(db: Session) -> Dict[str, Any]:
    budgets = db.query(CarbonBudget).all()
    projects = db.query(ReductionProject).all()
    
    total_allocated_tco2e = sum(b.allocated_tco2e for b in budgets)
    total_spent_tco2e = sum(b.spent_tco2e for b in budgets)
    total_financial_budget = sum(b.budget_amount for b in budgets)
    total_financial_spent = sum(b.spent_amount for b in budgets)
    
    total_investment = sum(p.investment_amount for p in projects)
    total_reduction_tco2e = sum(p.expected_reduction_tco2e for p in projects)
    
    project_economics = []
    for p in projects:
        cost_per_tco2e = round(p.investment_amount / max(p.expected_reduction_tco2e, 1.0), 2)
        project_economics.append({
            "id": p.id,
            "name": p.name,
            "category": p.category,
            "investment_amount": p.investment_amount,
            "expected_reduction_tco2e": p.expected_reduction_tco2e,
            "actual_reduction_tco2e": p.actual_reduction_tco2e,
            "roi_pct": p.roi_pct,
            "cost_per_tonne": cost_per_tco2e,
            "status": p.status,
            "owner": p.owner
        })
        
    return {
        "summary": {
            "total_allocated_tco2e": total_allocated_tco2e,
            "total_spent_tco2e": total_spent_tco2e,
            "remaining_carbon_tco2e": total_allocated_tco2e - total_spent_tco2e,
            "total_financial_budget": total_financial_budget,
            "total_financial_spent": total_financial_spent,
            "total_project_investment": total_investment,
            "total_project_reduction_tco2e": total_reduction_tco2e,
            "avg_cost_per_tco2e": round(total_investment / max(total_reduction_tco2e, 1.0), 2)
        },
        "projects": project_economics,
        "budgets": [
            {
                "id": b.id,
                "facility_id": b.facility_id,
                "year": b.year,
                "allocated_tco2e": b.allocated_tco2e,
                "spent_tco2e": b.spent_tco2e,
                "remaining_tco2e": b.remaining_tco2e,
                "budget_amount": b.budget_amount,
                "spent_amount": b.spent_amount
            } for b in budgets
        ]
    }
