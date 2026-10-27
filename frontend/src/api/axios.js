import axios from "axios";

// Creates a shared axios instance pointing to our Express backend API
const api = axios.create({
  baseURL: "http://localhost:5001/api",
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