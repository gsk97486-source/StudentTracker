import React, { createContext, useState, useEffect } from "react";
import api from "../api/axios.js";

export const AuthContext = createContext();

// Manages the logged-in user state and provides login, register, and logout functions
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // When the app loads, check if a valid token is stored in localStorage
  useEffect(() => {
    const checkLoggedInUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedInUser();
  }, []);

  // Logs in the user and saves the JWT token to localStorage
  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", response.data.token);
    setUser(response.data.user);
  };

  // Registers a new user and saves the JWT token to localStorage
  const register = async (name, email, password) => {
    const response = await api.post("/auth/register", { name, email, password });
    localStorage.setItem("token", response.data.token);
    setUser(response.data.user);
  };

  // Logs out the user by removing the JWT token from localStorage
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};