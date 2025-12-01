import { User } from '@/interfaces/user'

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface ForgotPasswordDto {
  email: string
}

export interface ResetPasswordDto {
  token: string
  new_password: string
  confirmPassword: string
}

class AuthService {
  // Login user
  async login(credentials: LoginDto): Promise<AuthResponse> {
    return { user: {} as User, token: 'mock-token' }
  }

  // Register new user
  async register(userData: RegisterDto): Promise<AuthResponse> {
    return { user: {} as User, token: 'mock-token' }
  }

  // Logout user
  async logout(): Promise<void> {
    return
  }

  // Get current user
  async getCurrentUser(): Promise<User> {
    return {} as User
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return false
  }

  // Forgot password - send email
  async forgotPassword(email: ForgotPasswordDto): Promise<{ message: string }> {
    return { message: 'Mock email sent' }
  }

  // Reset password with token
  async resetPassword(
    resetData: ResetPasswordDto
  ): Promise<{ message: string }> {
    return { message: 'Mock password reset' }
  }

  // Login user
  async loginWithSocial(
    socialId: string,
    email: string,
    name: string
  ): Promise<AuthResponse> {
    return { user: {} as User, token: 'mock-token' }
  }
}

export const authService = new AuthService()
