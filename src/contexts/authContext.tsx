import { useRouter } from 'next/navigation'
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react'

interface AuthContextType {
  accessToken: string | null
  isAuthenticated: boolean
  loading: boolean
  login: (token: string) => void
  logout: () => void
  refreshToken: () => Promise<void>
  loginWithoutRemember: (token: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if token exists in localStorage on mount
    const storedToken = localStorage.getItem('accessToken')
    if (storedToken) {
      setAccessToken(storedToken)
    }
    setLoading(false)
  }, [])

  const login = (token: string) => {
    localStorage.setItem('accessToken', token)
    setAccessToken(token)
    router.push('/ai')
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    setAccessToken(null)
    router.push('/')
  }

  const loginWithoutRemember = (token: string) => {
    setAccessToken(token)
    router.push('/ai')
  }

  const refreshToken = async (): Promise<void> => {
    try {
      setLoading(true)
      // Implement your token refresh logic here
      // Example:
      // const response = await fetch('/api/refresh-token', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ refreshToken: localStorage.getItem('refreshToken') }),
      // });
      // const data = await response.json();
      // if (data.accessToken) {
      //   login(data.accessToken);
      // }
    } catch (error) {
      console.error('Failed to refresh token:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const value = {
    accessToken,
    isAuthenticated: !!accessToken,
    loading,
    login,
    logout,
    refreshToken,
    loginWithoutRemember
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
