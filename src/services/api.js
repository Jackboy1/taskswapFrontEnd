import axios from 'axios';
import { clearToken } from './auth';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add request interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      clearToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Task API
export const fetchTasks = (params = {}) => api.get('/tasks', { params }).then(res => res.data);
export const createTask = (taskData) => api.post('/tasks', taskData).then(res => res.data);
export const updateTask = (id, taskData) => api.put(`/tasks/${id}`, taskData).then(res => res.data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`).then(res => res.data);
export const fetchTask = (id) => api.get(`/tasks/${id}`).then(res => res.data);

// Auth API
export const loginUser = (credentials) => api.post('/auth/login', credentials).then(res => res.data);
export const registerUser = (userData) => api.post('/auth/register', userData).then(res => res.data);
export const getCurrentUser = () => api.get('/auth/me').then(res => res.data);
export const updateProfile = (profileData) => api.put('/auth/me', profileData).then(res => res.data);

// Messaging API
export const fetchMessages = (taskId) => api.get(`/messages/${taskId}`).then(res => res.data);
export const sendMessage = (messageData) => api.post('/messages', messageData).then(res => res.data);

// Swap API
export const proposeSwap = (id, proposalData) => api.post(`/tasks/${id}/propose`, proposalData).then(res => res.data.task || res.data);


// TaskActivity API
export const fetchTasksByUser = (userId) => api.get(`/tasks/user/${userId}`).then(res => res.data);

export const submitRating = (taskId, userId, ratingData) => api.post(`/tasks/${taskId}/rate/${userId}`, ratingData).then(res => res.data);
// export const getUserRatings = (userId) => api.get(`/users/${userId}/ratings`).then(res => res.data);

export const completeTask = (id) => api.post(`/tasks/${id}`, { status: 'completed' }).then(res => res.data);