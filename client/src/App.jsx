import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";

// Shared Universal Navigation
import SharedNavBanner from "./layouts/SharedNavBanner";

// Route guard
import ProtectedRoute from "./components/ProtectedRoute";

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

/**
 * RootRedirect — if the user is already logged in and hits "/",
 * send them straight to their portal; otherwise go to /login.
 */
function RootRedirect() {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role === "admin") return <Navigate to="/admin" replace />;
  if (role === "advisor") return <Navigate to="/advisor" replace />;
  return <Navigate to="/student" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Top navigation bar (shown on every page) */}
        <SharedNavBanner />

        <Routes>
          {/* Root redirect based on auth/role */}
          <Route path="/" element={<RootRedirect />} />

          {/* Public login page */}
          <Route path="/login" element={<Login />} />

          {/* ── Student Portal (only accessible with role=student) ── */}
          <Route element={<ProtectedRoute allowedRole="student" />}>
            <Route path="/student" element={<StudentLayout />}>
              <Route index element={<StudentDashboard />} />
              <Route path="dashboard" element={<StudentDashboard />} />
            </Route>
          </Route>

          {/* ── Advisor Portal (only accessible with role=advisor) ── */}
          <Route element={<ProtectedRoute allowedRole="advisor" />}>
            <Route path="/advisor" element={<AdvisorLayout />}>
              <Route index element={<AdvisorDashboard />} />
              <Route path="dashboard" element={<AdvisorDashboard />} />
            </Route>
          </Route>

          {/* ── Admin Console (only accessible with role=admin) ── */}
          <Route element={<ProtectedRoute allowedRole="admin" />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
