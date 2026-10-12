from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
import models
from seed import seed_database

# Include all routers
from routers import (
    dashboard,
    activities,
    emissions,
    emission_factors,
    products,
    suppliers,
    analytics,
    scenarios,
    reduction,
    integrations,
    compliance,
    finance,
    reports,
    audit
)

app = FastAPI(
    title="DecarbX – Environmental Intelligence Platform API",
    description="Enterprise Carbon Accounting, Life Cycle Assessment, PCF, Supplier Sustainability & AI Decarbonization Intelligence Platform.",
    version="1.0.0"
)

# Configure CORS for local React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    # Initialize DB schema
    Base.metadata.create_all(bind=engine)
    
    # Auto-seed database if empty
    db = SessionLocal()
    try:
        org_count = db.query(models.Organization).count()
        if org_count == 0:
            print("No data found in database. Running seed script...")
            seed_database()
        else:
            print("DecarbX database exists and is ready.")
    finally:
        db.close()

# Mount API Routers
app.include_router(dashboard.router)
app.include_router(activities.router)
app.include_router(emissions.router)
app.include_router(emission_factors.router)
app.include_router(products.router)
app.include_router(suppliers.router)
app.include_router(analytics.router)
app.include_router(scenarios.router)
app.include_router(reduction.router)
app.include_router(integrations.router)
app.include_router(compliance.router)
app.include_router(finance.router)
app.include_router(reports.router)
app.include_router(audit.router)

@app.get("/")
def root():
    return {
        "platform": "DecarbX Environmental Intelligence Platform",
        "status": "Online",
        "version": "1.0.0",
        "docs_url": "http://localhost:8000/docs"
    }
