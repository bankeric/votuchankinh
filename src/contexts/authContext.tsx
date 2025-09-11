import { getMe } from '@/services/authService'
import { User } from '@/types'
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
  user: User | null
  isAuthenticated: boolean | undefined
  loading: boolean
  login: (token: string, user: User) => void
  logout: () => void
  refreshToken: () => Promise<void>
  loginWithoutRemember: (token: string, user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if token exists in localStorage on mount
    const storedToken = localStorage.getItem('accessToken')

    if (storedToken) {
      setLoading(true)
      isTokenValid(storedToken)
        .then((isValid) => {
          if (isValid) {
            const storedUser = localStorage.getItem('user')
            if (storedUser) {
              setUser(JSON.parse(storedUser))
            }
            setAccessToken(storedToken)
            setIsAuthenticated(true)
          } else {
            logout()
          }
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setIsAuthenticated(false)
    }
  }, [])

  const isTokenValid = async (token: string): Promise<boolean> => {
    try {
      const isValid = await getMe(token)
      return !!isValid
    } catch (error) {
      console.error('Token validation error:', error)
      return false
    }
  }

  const login = (token: string, user: User) => {
    localStorage.setItem('accessToken', token)
    localStorage.setItem('user', JSON.stringify(user))
    setAccessToken(token)
    setUser(user)
    setIsAuthenticated(true)
    router.push('/ai')
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    setAccessToken(null)
    setUser(null)
    setIsAuthenticated(false)
    router.push('/')
  }

  const loginWithoutRemember = (token: string, user: User) => {
    setAccessToken(token)
    setUser(user)
    setIsAuthenticated(true)
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
    user,
    isAuthenticated,
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
