import api from './axios'

export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentLeads: () => api.get('/dashboard/recent-leads'),
  getSourceBreakdown: () => api.get('/dashboard/source-breakdown'),
  getCampaignPerformance: () => api.get('/dashboard/campaign-performance'),
}
