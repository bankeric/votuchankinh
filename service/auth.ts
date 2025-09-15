import { User } from '@/interfaces/user';
import axiosInstance, { setAuthToken, removeAuthToken, getAuthToken } from '@/lib/axios';


export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  new_password: string;
  confirmPassword: string;
}

class AuthService {
  private readonly BASE_URL = '/api/v1';

  // Login user
  async login(credentials: LoginDto): Promise<AuthResponse> {
    try {
      const { data } = await axiosInstance.post<AuthResponse>(`${this.BASE_URL}/sign-in`, credentials);
      setAuthToken(data.token);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Register new user
  async register(userData: RegisterDto): Promise<AuthResponse> {
    try {
      const { data } = await axiosInstance.post<AuthResponse>(`${this.BASE_URL}/sign-up`, userData);
      setAuthToken(data.token);
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await axiosInstance.post(`${this.BASE_URL}/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeAuthToken();
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User> {
    try {
      const { data } = await axiosInstance.get<{user: User}>(`${this.BASE_URL}/users/me`);
      return data.user;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!getAuthToken();
  }

  // Forgot password - send email
  async forgotPassword(email: ForgotPasswordDto): Promise<{ message: string }> {
    try {
      const { data } = await axiosInstance.post<{ message: string }>(`${this.BASE_URL}/forgot-password`, email);
      return data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  // Reset password with token
  async resetPassword(resetData: ResetPasswordDto): Promise<{ message: string }> {
    try {
      const { data } = await axiosInstance.post<{ message: string }>(`${this.BASE_URL}/reset-password`, resetData);
      return data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService(); 