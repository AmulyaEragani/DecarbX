import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { FilterProvider } from './context/FilterContext';

// Page Imports
import { DashboardPage } from './pages/DashboardPage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { Scope1Page } from './pages/Scope1Page';
import { Scope2Page } from './pages/Scope2Page';
import { Scope3Page } from './pages/Scope3Page';
import { EmissionFactorsPage } from './pages/EmissionFactorsPage';
import { ProductsPage } from './pages/ProductsPage';
import { LCAPage } from './pages/LCAPage';
import { PCFPage } from './pages/PCFPage';
import { SuppliersPage } from './pages/SuppliersPage';
import { SupplierAssessmentsPage } from './pages/SupplierAssessmentsPage';
import { SupplierScorecardsPage } from './pages/SupplierScorecardsPage';
import { SupplierActionPlansPage } from './pages/SupplierActionPlansPage';
import { AIAnalyticsPage } from './pages/AIAnalyticsPage';
import { AnomaliesPage } from './pages/AnomaliesPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { ReductionTargetsPage } from './pages/ReductionTargetsPage';
import { ScenariosPage } from './pages/ScenariosPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { UploadDataPage } from './pages/UploadDataPage';
import { IntegrationsPage } from './pages/IntegrationsPage';
import { IoTMetersPage } from './pages/IoTMetersPage';
import { CompliancePage } from './pages/CompliancePage';
import { EvidencePage } from './pages/EvidencePage';
import { AuditTrailPage } from './pages/AuditTrailPage';
import { CarbonFinancePage } from './pages/CarbonFinancePage';
import { ProjectEconomicsPage } from './pages/ProjectEconomicsPage';
import { ReportsPage } from './pages/ReportsPage';

export function App() {
  return (
    <FilterProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            
            {/* Carbon Accounting */}
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/scope1" element={<Scope1Page />} />
            <Route path="/scope2" element={<Scope2Page />} />
            <Route path="/scope3" element={<Scope3Page />} />
            <Route path="/emission-factors" element={<EmissionFactorsPage />} />
            
            {/* Product Footprint */}
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/lca" element={<LCAPage />} />
            <Route path="/pcf" element={<PCFPage />} />
            
            {/* Suppliers */}
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/supplier-assessments" element={<SupplierAssessmentsPage />} />
            <Route path="/supplier-scorecards" element={<SupplierScorecardsPage />} />
            <Route path="/supplier-action-plans" element={<SupplierActionPlansPage />} />
            
            {/* AI Analytics */}
            <Route path="/analytics/insights" element={<AIAnalyticsPage />} />
            <Route path="/analytics/anomalies" element={<AnomaliesPage />} />
            <Route path="/analytics/recommendations" element={<RecommendationsPage />} />
            
            {/* Reduction Planning */}
            <Route path="/reduction/targets" element={<ReductionTargetsPage />} />
            <Route path="/scenarios" element={<ScenariosPage />} />
            <Route path="/reduction/projects" element={<ProjectsPage />} />
            
            {/* Data Sources */}
            <Route path="/upload" element={<UploadDataPage />} />
            <Route path="/integrations" element={<IntegrationsPage />} />
            <Route path="/iot-meters" element={<IoTMetersPage />} />
            
            {/* Compliance */}
            <Route path="/compliance" element={<CompliancePage />} />
            <Route path="/evidence" element={<EvidencePage />} />
            <Route path="/audit-trail" element={<AuditTrailPage />} />
            
            {/* Carbon Finance */}
            <Route path="/finance/budget" element={<CarbonFinancePage />} />
            <Route path="/finance/economics" element={<ProjectEconomicsPage />} />
            
            {/* Reports */}
            <Route path="/reports" element={<ReportsPage />} />
            
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Layout>
      </Router>
    </FilterProvider>
  );
}

export default App;
