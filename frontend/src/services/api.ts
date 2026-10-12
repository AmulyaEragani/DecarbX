import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const dashboardApi = {
  getSummary: (facilityId?: number, period?: string) =>
    api.get('/dashboard', { params: { facility_id: facilityId, period: period } }).then((res) => res.data),
  getFacilities: () => api.get('/facilities').then((res) => res.data),
};

export const activitiesApi = {
  list: () => api.get('/activities').then((res) => res.data),
  create: (data: any) => api.post('/activities', data).then((res) => res.data),
  uploadCsv: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/activities/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((res) => res.data);
  },
};

export const emissionsApi = {
  list: (scope?: string) => api.get('/emissions', { params: { scope } }).then((res) => res.data),
  calculate: (activityId: number) => api.post(`/emissions/calculate/${activityId}`).then((res) => res.data),
};

export const emissionFactorsApi = {
  list: () => api.get('/emission-factors').then((res) => res.data),
  create: (data: any) => api.post('/emission-factors', data).then((res) => res.data),
};

export const productsApi = {
  list: () => api.get('/products').then((res) => res.data),
  getDetails: (id: number) => api.get(`/products/${id}`).then((res) => res.data),
  calculatePcf: (id: number) => api.post(`/products/${id}/calculate-pcf`).then((res) => res.data),
};

export const suppliersApi = {
  list: () => api.get('/suppliers').then((res) => res.data),
  getDetails: (id: number) => api.get(`/suppliers/${id}`).then((res) => res.data),
  getScorecard: (id: number) => api.get(`/suppliers/${id}/scorecard`).then((res) => res.data),
};

export const analyticsApi = {
  getAll: () => api.get('/analytics/all').then((res) => res.data),
  getInsights: () => api.get('/analytics/insights').then((res) => res.data),
  getAnomalies: () => api.get('/analytics/anomalies').then((res) => res.data),
  getRecommendations: () => api.get('/analytics/recommendations').then((res) => res.data),
};

export const scenariosApi = {
  list: () => api.get('/scenarios').then((res) => res.data),
  simulate: (params: any) => api.post('/scenarios/simulate', params).then((res) => res.data),
  create: (data: any) => api.post('/scenarios', data).then((res) => res.data),
};

export const reductionApi = {
  getTargets: () => api.get('/reduction/targets').then((res) => res.data),
  getProjects: () => api.get('/reduction/projects').then((res) => res.data),
};

export const integrationsApi = {
  list: () => api.get('/integrations').then((res) => res.data),
  sync: (id: number) => api.post(`/integrations/${id}/sync`).then((res) => res.data),
};

export const complianceApi = {
  getOverview: () => api.get('/compliance').then((res) => res.data),
  getEvidence: () => api.get('/evidence').then((res) => res.data),
};

export const financeApi = {
  getOverview: () => api.get('/finance/summary').then((res) => res.data),
  getProjects: () => api.get('/finance/projects').then((res) => res.data),
  getBudgets: () => api.get('/finance/budget').then((res) => res.data),
};

export const reportsApi = {
  list: () => api.get('/reports').then((res) => res.data),
  exportCsv: (reportId: string) => `${API_BASE_URL}/reports/${reportId}/export`,
};

export const auditApi = {
  list: () => api.get('/audit-logs').then((res) => res.data),
};

export default api;
