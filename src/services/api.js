import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:9090/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

// Add token from localStorage to every request (Authorization header)
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
  recordWithImage: (formData) => api.post('/scans/with-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 30000,
  }),
  getRecent: () => api.get('/scans/recent'),
  getByPartId: (partId) => api.get(`/scans/part/${partId}`),
  getMyQueue: () => api.get('/scans/my-queue'),
  batchScan: (partIds, stage) => api.post('/scans/batch', { partIds, stage })
};

// ========== BLOCKCHAIN ==========
export const blockchainAPI = {
  getBlocks: () => api.get('/blockchain/blocks'),
  getLatest: () => api.get('/blockchain/latest'),
  getByPartId: (partId) => api.get(`/blockchain/part/${partId}`),
  verifyTransaction: (txHash) => api.get(`/blockchain/verify/${txHash}`),
  getIntegrity: () => api.get('/blockchain/integrity'),
  getNetworkStatus: () => api.get('/blockchain/network'),
  getEthBlocks: (count = 10) => api.get(`/blockchain/eth-blocks?count=${count}`),
  getStats: () => api.get('/blockchain/stats')
};

// ========== ANOMALIES ==========
export const anomaliesAPI = {
  getAll: () => api.get('/anomalies'),
  getById: (id) => api.get(`/anomalies/${id}`),
  resolve: (id) => api.put(`/anomalies/${id}/resolve`),
  getStats: () => api.get('/anomalies/stats'),
};

// ========== AI ==========
export const aiAPI = {
  getInsights: () => api.get('/ai/insights'),
  getBottleneck: () => api.get('/ai/bottleneck'),
  predictDefect: (partId) => api.get(`/ai/predict/${partId}`),
  getStatus: () => api.get('/ai/status'),
  getModelInfo: () => api.get('/ai/model-info'),
  inspectPart: (formData) => api.post('/ai/inspect', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 30000,
  }),
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

// ========== ASSIGNMENTS (Auto/Batch) ==========
export const assignmentsAPI = {
  autoAssign: (partId) => api.post(`/assignments/auto/${partId}`),
  batchAssign: (request) => api.post('/assignments/batch', request),
  autoAssignAll: () => api.post('/assignments/auto-all'),
  getPipeline: () => api.get('/assignments/pipeline')
};