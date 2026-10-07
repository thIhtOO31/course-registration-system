import React, { useState, useEffect } from "react";
import { AuthContext } from "./authContextInstance";
import { DEMO_USERS } from "../data/mockData";

export function AuthProvider({ children }) {
  // Initialize with student or persisted user
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("crs_user");
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore JSON parse error
    }
    return DEMO_USERS.student;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("crs_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("crs_user");
    }
  }, [currentUser]);

  const loginWithRole = (role) => {
    const selected = DEMO_USERS[role] || DEMO_USERS.student;
    setCurrentUser(selected);
    return selected;
  };

  const loginWithCredentials = (email, password, role = "student") => {
    const matchedUser = DEMO_USERS[role] || {
      id: "usr_custom",
      name: email.split("@")[0] || "User",
      email,
      role
    };
    setCurrentUser(matchedUser);
    return matchedUser;
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
        loginWithRole,
        loginWithCredentials,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
