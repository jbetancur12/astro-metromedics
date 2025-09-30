import axios from 'axios'

// API base URL - use environment variable or default to localhost
const API_BASE_URL = import.meta.env.PUBLIC_API_URL || 'https://api.metromedicslab.com.co'

// Public axios instance for maintenance endpoints (no auth required)
export const axiosPublic = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Response interceptor for error handling
axiosPublic.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export default axiosPublic