import axios from 'axios'

const API_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_URL,
})

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
}

// Profile API
export const profileAPI = {
  getProfile: (id) => api.get(`/profile/${id}`),
  updateProfile: (data) => api.put('/profile', data),
  getEntrepreneurs: () => api.get('/profile/users/entrepreneurs'),
  getInvestors: () => api.get('/profile/users/investors'),
}

// Request API
export const requestAPI = {
  sendRequest: (data) => api.post('/request', data),
  getRequests: () => api.get('/request'),
  updateRequestStatus: (id, status) => api.patch(`/request/${id}`, { status }),
}

// Chat API
export const chatAPI = {
  getMessages: (userId) => api.get(`/chat/${userId}`),
  sendMessage: (data) => api.post('/chat', data),
  getChatPartners: () => api.get('/chat/partners/all'),
}

export default api