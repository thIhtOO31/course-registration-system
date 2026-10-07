import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { GraduationCap, UserCheck, Shield, BookOpen } from "lucide-react";

export default function Login() {
  const { loginWithCredentials, loginWithRole } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("2310030015@students.stamford.edu");
  const [password, setPassword] = useState("password123");
  const [selectedRole, setSelectedRole] = useState("student");

  const handleSubmit = (e) => {
    e.preventDefault();
    loginWithCredentials(email, password, selectedRole);
    navigate(`/${selectedRole}`);
  };

  const handleDemoLogin = (role) => {
    loginWithRole(role);
    navigate(`/${role}`);
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card">
        {/* Brand Header */}
        <div className="login-brand-header">
          <div className="login-brand-icon">
            <GraduationCap size={28} />
          </div>
          <h1>Course Registration System</h1>
          <p>Sign in to access student, advisor, or admin portals</p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email-input" className="form-label">
              University Email / ID
            </label>
            <input
              id="email-input"
              type="email"
              required
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. 2310030015@students.stamford.edu"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password-input" className="form-label">
              Password
            </label>
            <input
              id="password-input"
              type="password"
              required
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role-select" className="form-label">
              Portal Account Type
            </label>
            <select
              id="role-select"
              className="form-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="student">Student Portal</option>
              <option value="advisor">Academic Advisor Portal</option>
              <option value="admin">Administrator Console</option>
            </select>
          </div>

          <button type="submit" className="login-submit-btn" id="btn-login-submit">
            Sign In to Account
          </button>
        </form>

        {/* Quick Demo Sign-Ins */}
        <div className="demo-login-divider">
          <span>Or Quick 1-Click Demo Login</span>
        </div>

        <div className="demo-buttons-grid">
          <button
            type="button"
            className="demo-role-btn"
            id="demo-login-student"
            onClick={() => handleDemoLogin("student")}
          >
            <div className="demo-role-btn-left">
              <BookOpen size={16} className="text-blue-600" />
              <span>Aung Kaung Myat</span>
            </div>
            <span className="demo-role-btn-role role-student-pill">Student</span>
          </button>

          <button
            type="button"
            className="demo-role-btn"
            id="demo-login-advisor"
            onClick={() => handleDemoLogin("advisor")}
          >
            <div className="demo-role-btn-left">
              <UserCheck size={16} className="text-emerald-600" />
              <span>Dr. Somchai Prasert</span>
            </div>
            <span className="demo-role-btn-role role-advisor-pill">Advisor</span>
          </button>

          <button
            type="button"
            className="demo-role-btn"
            id="demo-login-admin"
            onClick={() => handleDemoLogin("admin")}
          >
            <div className="demo-role-btn-left">
              <Shield size={16} className="text-indigo-600" />
              <span>Registrar Office</span>
            </div>
            <span className="demo-role-btn-role role-admin-pill">Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
}
