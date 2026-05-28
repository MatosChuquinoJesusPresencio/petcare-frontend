import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.DEV ? '' : import.meta.env.VITE_URL_API,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        await apiClient.post('/api/auth/refresh')
        return apiClient(originalRequest)
      } catch {
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  },
)

export default apiClient
