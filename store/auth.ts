import { User } from '@/interfaces/user'
import { removeAuthToken } from '@/lib/axios'
import { authService, LoginDto } from '@/service/auth'
import { AxiosError } from 'axios'
import router from 'next/router'

import { create } from 'zustand'

interface AuthState {
  user: User | null
  login: (formData: LoginDto) => Promise<void>
  loginWithSocial: (
    socialId: string,
    email: string,
    name: string
  ) => Promise<void>
  logout: () => Promise<void>
  getCurrentUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>()((set, get) => {
  return {
    user: null,
    login: async (formData: LoginDto) => {
      const data = await authService.login(formData)
      set({ user: data.user })
    },
    loginWithSocial: async (socialId: string, email: string, name: string) => {
      const data = await authService.loginWithSocial(socialId, email, name)
      set({ user: data.user })
    },
    logout: async () => {
      await authService.logout()
      set({ user: null })
      removeAuthToken()
    },
    getCurrentUser: async () => {
      try {
        const user = await authService.getCurrentUser()
        set({ user })
      } catch (error) {
        console.log('Error getting current user:', error)
        // if 404, redirect to login
        removeAuthToken()
        // appToast('Please login to continue', {
        //   type: 'error'
        // })
        if (error instanceof AxiosError && error.response?.status === 401) {
          router.push('/ai/new')
        }
      }
    }
  }
})
