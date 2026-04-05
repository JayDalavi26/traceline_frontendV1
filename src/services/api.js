import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:9090/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true   // ← important: sends cookies with every request
});

// No request interceptor needed for token – cookie is automatic

// Auth APIs
export const authAPI = {
  login: (username, password, role) => api.post('/auth/login', { username, password, role }),
  logout: () => api.post('/auth/logout'),
  registerOperator: (data) => api.post('/auth/register-operator', data)
};

export const operatorsAPI = {
  getAll: () => api.get('/operators'),
  add: (data) => api.post('/operators', data),
  update: (id, data) => api.put(`/operators/${id}`, data),
  delete: (id, notifyEmail) => api.delete(`/operators/${id}?notifyEmail=${notifyEmail}`),
};

// ========== SCANS ==========
export const scansAPI = {
  record: (scanData) => api.post('/scans', scanData),
  getRecent: () => api.get('/scans/recent'),
  getByPartId: (partId) => api.get(`/scans/part/${partId}`)
};

// ========== BLOCKCHAIN ==========
export const blockchainAPI = {
  getBlocks: () => api.get('/blockchain/blocks'),
  getLatest: () => api.get('/blockchain/latest'),
  getByPartId: (partId) => api.get(`/blockchain/part/${partId}`)
};

// ========== ANOMALIES ==========
export const anomaliesAPI = {
  getAll: () => api.get('/anomalies'),
  getById: (id) => api.get(`/anomalies/${id}`),
  resolve: (id) => api.put(`/anomalies/${id}/resolve`)
};

// ========== AI ==========
export const aiAPI = {
  getInsights: () => api.get('/ai/insights'),
  getBottleneck: () => api.get('/ai/bottleneck'),
  predictDefect: (partId) => api.get(`/ai/predict/${partId}`)
};

// ========== DASHBOARD ==========
export const dashboardAPI = {
  getMetrics: () => api.get('/dashboard/metrics')
};

export const partsAPI = {
  getAll: () => api.get('/parts'),
  getById: (partId) => api.get(`/parts/${partId}`),
  create: (partData) => api.post('/parts', partData),   // ← for registering new part
  updateStage: (partId, stage, operatorId) => api.put(`/parts/${partId}/stage?stage=${stage}&operatorId=${operatorId}`)
};