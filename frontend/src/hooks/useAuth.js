import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { authApi } from '../api/authApi'
import toast from 'react-hot-toast'

export function useAuth() {
  const navigate = useNavigate()
  const { token, user, setAuth, logout: storeLogout } = useAuthStore()

  const login = useCallback(async (data) => {
    const res = await authApi.login(data)
    const { accessToken, refreshToken, user } = res.data.data
    setAuth(accessToken, refreshToken, user)
    navigate('/dashboard')
  }, [setAuth, navigate])

  const register = useCallback(async (data) => {
    const res = await authApi.register(data)
    const { accessToken, refreshToken, user } = res.data.data
    setAuth(accessToken, refreshToken, user)
    navigate('/onboarding')
  }, [setAuth, navigate])

  const logout = useCallback(async () => {
    try { await authApi.logout() } catch {}
    storeLogout()
    navigate('/login')
    toast.success('Logged out')
  }, [storeLogout, navigate])

  return { token, user, login, register, logout, isAuthenticated: !!token }
}
