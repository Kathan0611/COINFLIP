import axios from 'axios'
import * as storage from '../helpers/storageRequests'

// define API_URL and APP ID in env file
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_ENDPOINT,
})
axiosInstance.interceptors.request.use((config) => {
  console.log('Request payload:', config.data)
  const token = storage.getAuth()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      if (
        error?.response?.status === 401 &&
        error?.response?.data?.status === false &&
        error.response?.data?.message === 'Unauthorized!'
      ) {
        storage.removeAuth()
        error.response.data.message = 'Your Session is expiered,Please login again!'
        setTimeout(() => {}, 3000)
      } else if (error?.response?.status === 403 && error?.response?.data?.status === false) {
        error.response.data.message = "you don't have permission to access this"
        setTimeout(() => {}, 3000)
      }
      return Promise.reject(error)
    } else {
      return Promise.reject(error)
    }
  },
)
