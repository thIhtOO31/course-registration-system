import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

/**
 * ProtectedRoute — wraps a route tree with:
 *  1. Auth check: redirects to /login if not logged in.
 *  2. Role check: redirects to the user's own portal if they try to access
 *     a portal that doesn't match their role.
 *
 * Usage in App.jsx:
 *   <Route element={<ProtectedRoute allowedRole="student" />}>
 *     <Route path="/student" element={<StudentLayout />}>…</Route>
 *   </Route>
 */
export default function ProtectedRoute({ allowedRole }) {
  const { isAuthenticated, role } = useAuth();

  // 1. Not logged in → go to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Logged in but wrong role → send them to their actual portal
  if (allowedRole && role !== allowedRole) {
    if (role === "admin") return <Navigate to="/admin" replace />;
    if (role === "advisor") return <Navigate to="/advisor" replace />;
    return <Navigate to="/student" replace />;
  }

  // 3. All good — render the child routes
  return <Outlet />;
}
