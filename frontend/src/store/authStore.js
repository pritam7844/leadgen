import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null,

      setAuth: (token, refreshToken, user) =>
        set({ token, refreshToken, user }),

      updateUser: (user) => set({ user }),

      logout: () => set({ token: null, refreshToken: null, user: null }),

      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
)
