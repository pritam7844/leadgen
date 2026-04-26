import api from './axios'

export const leadApi = {
  getLeads: (params) => api.get('/leads', { params }),
  createLead: (data) => api.post('/leads', data),
  getLead: (id) => api.get(`/leads/${id}`),
  updateLead: (id, data) => api.put(`/leads/${id}`, data),
  deleteLead: (id) => api.delete(`/leads/${id}`),
  bulkDelete: (ids) => api.post('/leads/bulk-delete', { ids }),
  exportLeads: () => api.post('/leads/export', {}, { responseType: 'blob' }),
  getStats: () => api.get('/leads/stats'),
}
