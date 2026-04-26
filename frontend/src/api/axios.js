import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import logger from '../utils/logger'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  
  logger.api('request', config.method, config.url, config.data)
  return config
})

let isRefreshing = false
let queue = []

api.interceptors.response.use(
  (res) => {
    logger.api('response', res.config.method, res.config.url, res.data)
    return res
  },
  async (err) => {
    logger.api('error', err.config?.method || 'unknown', err.config?.url || 'unknown', err.response?.data || err.message)
    
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject })
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`
          return api(original)
        })
      }
      isRefreshing = true
      const refreshToken = useAuthStore.getState().refreshToken
      try {
        logger.info('Attempting token refresh...')
        const res = await axios.post('/api/auth/refresh', { refreshToken })
        const { accessToken, user } = res.data.data
        useAuthStore.getState().setAuth(accessToken, refreshToken, user)
        queue.forEach((p) => p.resolve(accessToken))
        queue = []
        original.headers.Authorization = `Bearer ${accessToken}`
        return api(original)
      } catch (refreshErr) {
        logger.error('Token refresh failed', refreshErr)
        useAuthStore.getState().logout()
        queue.forEach((p) => p.reject())
        queue = []
        window.location.href = '/login'
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(err)
  }
)

export default api
