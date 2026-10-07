import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { GraduationCap, Lock, Mail } from "lucide-react";

export default function Login() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    try {
      const user = await login(email, password);
      // Role is determined by the server — redirect accordingly
      const role = user?.role;
      if (role === "admin") navigate("/admin", { replace: true });
      else if (role === "advisor") navigate("/advisor", { replace: true });
      else navigate("/student", { replace: true });
    } catch (err) {
      setFormError(err.message || "Invalid email or password.");
    }
  };

  const displayError = formError || error;

  return (
    <div className="login-page-wrapper">
      <div className="login-card">
        {/* Brand Header */}
        <div className="login-brand-header">
          <div className="login-brand-icon">
            <GraduationCap size={28} />
          </div>
          <h1>Course Registration System</h1>
          <p>Sign in with your university credentials to continue</p>
        </div>

        {/* Error Banner */}
        {displayError && (
          <div
            className="login-error-banner"
            role="alert"
            id="login-error-msg"
          >
            {displayError}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email-input" className="form-label">
              <Mail size={14} style={{ display: "inline", marginRight: 4 }} />
              University Email
            </label>
            <input
              id="email-input"
              type="email"
              required
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. 2310030015@students.stamford.edu"
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password-input" className="form-label">
              <Lock size={14} style={{ display: "inline", marginRight: 4 }} />
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
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="login-submit-btn"
            id="btn-login-submit"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {/* Hint about roles */}
        <p className="login-role-hint">
          Your portal (Student / Advisor / Admin) is determined automatically
          by your account type.
        </p>
      </div>
    </div>
  );
}
