import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";

// Shared Universal Navigation
import SharedNavBanner from "./layouts/SharedNavBanner";

// Three Distinct Role Layouts
import StudentLayout from "./layouts/StudentLayout";
import AdvisorLayout from "./layouts/AdvisorLayout";
import AdminLayout from "./layouts/AdminLayout";

// Role Dashboard Pages & Login Page
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import AdvisorDashboard from "./pages/AdvisorDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import "./App.css";

function RootRedirect() {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role === "admin") return <Navigate to="/admin" replace />;
  if (currentUser.role === "advisor") return <Navigate to="/advisor" replace />;
  return <Navigate to="/student" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Universal Top Navigation: readable links to Login, Student, Advisor, Admin */}
        <SharedNavBanner />

        <Routes>
          <Route path="/" element={<RootRedirect />} />

          {/* Standalone Login (Different from dashboards, no sidebar) */}
          <Route path="/login" element={<Login />} />

          {/* 1. Student Portal Layout & Dashboard */}
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<StudentDashboard />} />
            <Route path="dashboard" element={<StudentDashboard />} />
          </Route>

          {/* 2. Advisor Portal Layout & Dashboard */}
          <Route path="/advisor" element={<AdvisorLayout />}>
            <Route index element={<AdvisorDashboard />} />
            <Route path="dashboard" element={<AdvisorDashboard />} />
          </Route>

          {/* 3. Admin Console Layout & Dashboard */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
