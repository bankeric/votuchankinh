import axios from 'axios'

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    return Promise.reject(new Error('API connection is disabled'))
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling common errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error)
  }
)

// Auth helper functions
export const setAuthToken = (token: string) => { }

export const removeAuthToken = () => { }

export const getAuthToken = () => {
  return null
}

export default axiosInstance
