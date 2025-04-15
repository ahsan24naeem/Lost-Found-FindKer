import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const itemsApi = {
  // Get all posts
  getPosts: () => api.get('/post'),
  
  // Get post by ID
  getPostById: (id) => api.get(`/post/${id}`),
  
  // Create new post
  createPost: (data) => api.post('/post', data),
  
  // Update post
  updatePost: (id, data) => api.put(`/post/${id}`, data),
  
  // Delete post
  deletePost: (id) => api.delete(`/post/${id}`),
  
  // Get posts by user
  getPostsByUser: (userId) => api.get(`/post/user/${userId}`),
};

export const authApi = {
  // Login
  login: (credentials) => api.post('/user/login', credentials),
  
  // Register
  register: (userData) => api.post('/user/register', userData),
  
  // Get current user
  getCurrentUser: () => api.get('/user/me'),
  
  // Update profile
  updateProfile: (data) => api.put('/user/profile', data),
};

export const claimApi = {
  // Create claim
  createClaim: (data) => api.post('/claim', data),
  
  // Get claims by post
  getClaimsByPost: (postId) => api.get(`/claim/post/${postId}`),
  
  // Get claims by user
  getClaimsByUser: (userId) => api.get(`/claim/user/${userId}`),
  
  // Update claim status
  updateClaimStatus: (id, data) => api.put(`/claim/${id}/status`, data),
};

export const messageApi = {
  // Send message
  sendMessage: (data) => api.post('/message', data),
  
  // Get messages
  getMessages: (userId) => api.get(`/message/${userId}`),
};

export const notificationApi = {
  // Get notifications
  getNotifications: () => api.get('/notification'),
  
  // Mark notification as read
  markAsRead: (id) => api.put(`/notification/${id}/read`),
};

export const adminApi = {
  // Get flagged items
  getFlaggedItems: () => api.get('/admin/flagged-items'),
  
  // Resolve dispute
  resolveDispute: (id, data) => api.post(`/admin/disputes/${id}/resolve`, data),
  
  // Get statistics
  getStatistics: () => api.get('/admin/statistics'),
};

export default api; 