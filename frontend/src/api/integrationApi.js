import api from './axios'

export const integrationApi = {
  getIntegrations: () => api.get('/integrations'),
  createIntegration: (data) => api.post('/integrations', data),
  testIntegration: (id) => api.post(`/integrations/${id}/test`),
  runIntegration: (id) => api.post(`/integrations/${id}/run`),
  apolloSearch: (filters) => api.post('/integrations/apollo/search', filters),
  ghlSync: () => api.post('/integrations/ghl/sync'),
  apifyRun: (data) => api.post('/integrations/apify/run', data),
}
