import axios from 'axios'
import { API_BASE_URL } from './apiUrl'

// Public axios instance for maintenance endpoints (no auth required)
export const axiosPublic = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    // 'Content-Type': 'application/json'
  }
})

// Response interceptor for error handling
axiosPublic.interceptors.response.use(
  (response) => response,
  (error) => {
    // console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export default axiosPublic