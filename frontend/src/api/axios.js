import axios from "axios";

// In production on Vercel (same-origin), /api routes are rewritten directly to the backend service.
// In local dev, fallback to VITE_API_URL or http://localhost:5001/api.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5001/api" : "/api"),
});

// Automatically attaches the JWT token from localStorage to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;