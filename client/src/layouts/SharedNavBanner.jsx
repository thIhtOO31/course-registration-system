import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { GraduationCap, Briefcase, Shield, LogIn, LogOut } from "lucide-react";

export default function SharedNavBanner() {
  const { currentUser, role, loginWithRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleRoleSwitch = (newRole) => {
    loginWithRole(newRole);
    navigate(`/${newRole}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="shared-nav-banner">
      <div className="shared-nav-container">
        {/* Portal Title */}
        <div className="shared-nav-brand">
          <GraduationCap size={20} />
          <span>AU Course Registration System</span>
        </div>

        {/* Readable Navigation Links */}
        <nav className="shared-nav-links" aria-label="Portal Navigation">
          <NavLink
            to="/login"
            className={({ isActive }) => `shared-nav-link ${isActive ? "active" : ""}`}
            id="nav-link-login"
          >
            <LogIn size={14} />
            <span>Login</span>
          </NavLink>

          <NavLink
            to="/student"
            className={({ isActive }) => `shared-nav-link ${isActive ? "active" : ""}`}
            id="nav-link-student"
          >
            <GraduationCap size={14} />
            <span>Student Portal</span>
          </NavLink>

          <NavLink
            to="/advisor"
            className={({ isActive }) => `shared-nav-link ${isActive ? "active" : ""}`}
            id="nav-link-advisor"
          >
            <Briefcase size={14} />
            <span>Advisor Portal</span>
          </NavLink>

          <NavLink
            to="/admin"
            className={({ isActive }) => `shared-nav-link ${isActive ? "active" : ""}`}
            id="nav-link-admin"
          >
            <Shield size={14} />
            <span>Admin Console</span>
          </NavLink>
        </nav>

        {/* Current User & Role Switcher */}
        <div className="shared-nav-user">
          {currentUser ? (
            <>
              <div style={{ display: "flex", gap: "4px" }}>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch("student")}
                  className={`shared-nav-link ${role === "student" ? "active" : ""}`}
                  style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem" }}
                  title="Switch to Student View"
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch("advisor")}
                  className={`shared-nav-link ${role === "advisor" ? "active" : ""}`}
                  style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem" }}
                  title="Switch to Advisor View"
                >
                  Advisor
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch("admin")}
                  className={`shared-nav-link ${role === "admin" ? "active" : ""}`}
                  style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem" }}
                  title="Switch to Admin View"
                >
                  Admin
                </button>
              </div>

              <div className="user-badge">
                <span>{currentUser.name}</span>
                <span className={`user-badge-role ${role}`}>{role}</span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="logout-btn-nav"
                id="btn-logout"
                title="Log out"
              >
                <LogOut size={12} />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <span className="user-badge">Guest Session</span>
          )}
        </div>
      </div>
    </header>
  );
}
