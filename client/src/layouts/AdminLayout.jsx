import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import {
  Shield,
  LayoutDashboard,
  Layers,
  Settings,
  Users,
  CalendarCheck,
  Server,
  UserCheck
} from "lucide-react";

export default function AdminLayout() {
  const { currentUser } = useAuth();
  const admin = currentUser || {
    name: "Academic Registrar",
    role: "admin",
    office: "Office of the Registrar",
    systemStatus: "Healthy / Online"
  };

  return (
    <div className="portal-layout layout-admin">
      {/* Admin Sidebar */}
      <aside className="portal-sidebar" aria-label="Admin Navigation">
        <div className="sidebar-top">
          <div className="sidebar-brand-box">
            <div className="brand-icon-box">
              <Shield size={22} />
            </div>
            <div>
              <div className="brand-title">Admin Console</div>
              <div className="brand-subtitle">Registrar Operations</div>
            </div>
          </div>

          <ul className="sidebar-menu">
            <li>
              <NavLink
                to="/admin"
                end
                className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                id="admin-nav-dashboard"
              >
                <LayoutDashboard size={18} />
                <span>System Overview</span>
              </NavLink>
            </li>
            <li>
              <a href="#courses" className="sidebar-link" onClick={(e) => e.preventDefault()}>
                <Layers size={18} />
                <span>Course Catalog</span>
              </a>
            </li>
            <li>
              <a href="#users" className="sidebar-link" onClick={(e) => e.preventDefault()}>
                <Users size={18} />
                <span>User Accounts</span>
              </a>
            </li>
            <li>
              <a href="#windows" className="sidebar-link" onClick={(e) => e.preventDefault()}>
                <CalendarCheck size={18} />
                <span>Registration Windows</span>
              </a>
            </li>
            <li>
              <a href="#settings" className="sidebar-link" onClick={(e) => e.preventDefault()}>
                <Settings size={18} />
                <span>System Settings</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Admin Bottom Card */}
        <div className="sidebar-bottom">
          <div className="sidebar-profile-card">
            <span className="profile-card-name">{admin.name}</span>
            <span className="profile-card-detail">{admin.office || "Registrar"}</span>
            <span className="profile-card-detail" style={{ color: "#059669" }}>
              ● {admin.systemStatus || "Online"}
            </span>
          </div>
        </div>
      </aside>

      {/* Main Admin Portal Content */}
      <div className="portal-main">
        <header className="portal-header">
          <div className="header-left">
            <div>
              <div className="header-page-title">University Registrar Administration</div>
              <div className="header-breadcrumbs">Home / Admin / System Overview</div>
            </div>
          </div>

          <div className="header-right">
            <div className="header-pill header-accent-badge">
              <Server size={14} />
              <span>Fall 2026 (Registration Open)</span>
            </div>

            <div className="user-avatar-tag">
              <div className="user-avatar-circle">
                <UserCheck size={16} />
              </div>
              <span>{admin.name}</span>
            </div>
          </div>
        </header>

        <main className="portal-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
