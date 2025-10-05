import axios from 'axios';

// This will be the backend API URL - your brother will replace this
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  signup: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/signup', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),
};

// Books APIs
export const booksAPI = {
  getAll: (params?: { page?: number; limit?: number; search?: string; genre?: string; sort?: string }) =>
    api.get('/books', { params }),
  getById: (id: string) => api.get(`/books/${id}`),
  create: (data: FormData) => api.post('/books', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id: string, data: FormData) => api.put(`/books/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id: string) => api.delete(`/books/${id}`),
  getTrending: () => api.get('/books/trending'),
  getReviews: (id: string, params?: { page?: number; limit?: number; sort?: string }) =>
    api.get(`/books/${id}/reviews`, { params }),
};

// Reviews APIs
export const reviewsAPI = {
  getAll: (params?: { page?: number; limit?: number }) =>
    api.get('/reviews', { params }),
  create: (bookId: string, data: { rating: number; text: string; spoiler?: boolean }) =>
    api.post(`/books/${bookId}/reviews`, data),
  update: (id: string, data: { rating: number; text: string; spoiler?: boolean }) =>
    api.put(`/reviews/${id}`, data),
  delete: (id: string) => api.delete(`/reviews/${id}`),
  like: (id: string) => api.post(`/reviews/${id}/like`),
  unlike: (id: string) => api.delete(`/reviews/${id}/like`),
};

// Users APIs
export const usersAPI = {
  getById: (id: string) => api.get(`/users/${id}`),
  update: (id: string, data: FormData) => api.put(`/users/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getReviews: (id: string, params?: { page?: number; limit?: number }) =>
    api.get(`/users/${id}/reviews`, { params }),
  follow: (id: string) => api.post(`/users/${id}/follow`),
  unfollow: (id: string) => api.delete(`/users/${id}/follow`),
};

// Comments APIs
export const commentsAPI = {
  create: (reviewId: string, data: { text: string; parentId?: string }) =>
    api.post(`/reviews/${reviewId}/comments`, data),
  update: (id: string, data: { text: string }) =>
    api.put(`/comments/${id}`, data),
  delete: (id: string) => api.delete(`/comments/${id}`),
};

// Admin APIs
export const adminAPI = {
  getUsers: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get('/admin/users', { params }),
  updateUserRole: (id: string, role: string) =>
    api.put(`/admin/users/${id}/role`, { role }),
  banUser: (id: string) => api.put(`/admin/users/${id}/ban`),
  unbanUser: (id: string) => api.put(`/admin/users/${id}/unban`),
  getAnalytics: () => api.get('/admin/analytics'),
  getFlaggedContent: () => api.get('/admin/flagged-content'),
};

export default api;
