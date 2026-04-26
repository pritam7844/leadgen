import api from './axios'

export const sourceApi = {
  getSources: () => api.get('/sources'),
  createSource: (data) => api.post('/sources', data),
  getSource: (id) => api.get(`/sources/${id}`),
  updateSource: (id, data) => api.put(`/sources/${id}`, data),
  deleteSource: (id) => api.delete(`/sources/${id}`),
  runSource: (id) => api.post(`/sources/${id}/run`),
  testSource: (id) => api.post(`/sources/${id}/test`),
  csvUpload: (file) => {
    const form = new FormData()
    form.append('file', file)
    return api.post('/sources/csv-upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  getScrapers: () => api.get('/scrapers'),
  createScraper: (data) => api.post('/scrapers', data),
  toggleScraper: (id) => api.put(`/scrapers/${id}/toggle`),
  runScraper: (id) => api.post(`/scrapers/${id}/run`),
}
