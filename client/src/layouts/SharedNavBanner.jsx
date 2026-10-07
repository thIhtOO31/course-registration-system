import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { GraduationCap, LogIn, LogOut } from "lucide-react";

/**
 * Top navigation banner shown on every page.
 * When the user is logged in it shows their name, role badge, and a logout button.
 * The portal links (Student / Advisor / Admin) are hidden when logged out, and are
 * no longer usable as a role-switcher — navigation is controlled by login.
 */
export default function SharedNavBanner() {
  const { currentUser, role, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

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
          <span>Course Registration System</span>
        </div>

        {/* Right side: user info OR login link */}
        <div className="shared-nav-user">s
          {isAuthenticated && currentUser ? (
            <>
              {/* User badge showing name + role */}
              <div className="user-badge">
                <span>{currentUser.name}</span>
                <span className={`user-badge-role ${role}`}>{role}</span>
              </div>

              {/* Sign out */}
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
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `shared-nav-link ${isActive ? "active" : ""}`
              }
              id="nav-link-login"
            >
              <LogIn size={14} />
              <span>Login</span>
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}
