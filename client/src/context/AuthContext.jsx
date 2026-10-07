import React, { useState, useEffect } from "react";
import { AuthContext } from "./authContextInstance";
import { authApi } from "../services/api";

export function AuthProvider({ children }) {
  // Start as null — user must log in explicitly
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("crs_user");
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore JSON parse error
    }
    return null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Persist user session to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("crs_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("crs_user");
      localStorage.removeItem("crs_token");
    }
  }, [currentUser]);

  /**
   * Real login — calls POST /api/auth/login.
   * Stores the JWT token and user profile.
   * Returns the user object on success, throws on failure.
   */
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.login(email, password);
      // Store JWT separately so the API client can attach it
      localStorage.setItem("crs_token", data.token);
      setCurrentUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || null,
        isAuthenticated: !!currentUser,
        loading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
