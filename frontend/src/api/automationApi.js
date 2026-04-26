import api from './axios'

export const automationApi = {
  // Email
  getEmailProviders: () => api.get('/automation/email/providers'),
  createEmailProvider: (data) => api.post('/automation/email/providers', data),
  updateEmailProvider: (id, data) => api.put(`/automation/email/providers/${id}`, data),
  deleteEmailProvider: (id) => api.delete(`/automation/email/providers/${id}`),
  testEmailProvider: (id) => api.post(`/automation/email/providers/${id}/test`),
  sendEmail: (data) => api.post('/automation/email/send', data),

  // Calling
  getCallConfigs: () => api.get('/automation/calling/configs'),
  createCallConfig: (data) => api.post('/automation/calling/configs', data),
  updateCallConfig: (id, data) => api.put(`/automation/calling/configs/${id}`, data),
  deleteCallConfig: (id) => api.delete(`/automation/calling/configs/${id}`),
  getCallProviders: () => api.get('/automation/calling/providers'),

  // WhatsApp
  getWhatsAppConfigs: () => api.get('/automation/whatsapp/configs'),
  createWhatsAppConfig: (data) => api.post('/automation/whatsapp/configs', data),
  updateWhatsAppConfig: (id, data) => api.put(`/automation/whatsapp/configs/${id}`, data),
  getWhatsAppProviders: () => api.get('/automation/whatsapp/providers'),
  sendWhatsApp: (data) => api.post('/automation/whatsapp/send', data),

  // Meetings
  getMeetingConfigs: () => api.get('/automation/meetings/configs'),
  createMeetingConfig: (data) => api.post('/automation/meetings/configs', data),
  getMeetingProviders: () => api.get('/automation/meetings/providers'),
  bookMeeting: (data) => api.post('/automation/meetings/book', data),

  // Campaigns
  getCampaigns: () => api.get('/campaigns'),
  createCampaign: (data) => api.post('/campaigns', data),
  getCampaign: (id) => api.get(`/campaigns/${id}`),
  updateCampaign: (id, data) => api.put(`/campaigns/${id}`, data),
  deleteCampaign: (id) => api.delete(`/campaigns/${id}`),
  startCampaign: (id) => api.post(`/campaigns/${id}/start`),
  pauseCampaign: (id) => api.post(`/campaigns/${id}/pause`),
  getCampaignStats: (id) => api.get(`/campaigns/${id}/stats`),
}
