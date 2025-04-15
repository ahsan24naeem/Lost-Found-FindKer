// src/services/api.js
import axios from "axios";

const authApi = axios.create({
  baseURL: 'http://localhost:5000/api/auth', // Replace with your actual backend URL
});

// Add token from localStorage to each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { authApi };