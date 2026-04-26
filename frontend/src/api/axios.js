import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let isRefreshing = false
let queue = []

api.interceptors.response.use(
  (res) => res,
  async (err) => {
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
        const res = await axios.post('/api/auth/refresh', { refreshToken })
        const { accessToken, user } = res.data.data
        useAuthStore.getState().setAuth(accessToken, refreshToken, user)
        queue.forEach((p) => p.resolve(accessToken))
        queue = []
        original.headers.Authorization = `Bearer ${accessToken}`
        return api(original)
      } catch {
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
