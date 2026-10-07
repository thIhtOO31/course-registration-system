import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import {
  Briefcase,
  LayoutDashboard,
  Users,
  ClipboardCheck,
  MessageSquare,
  User,
  AlertCircle
} from "lucide-react";

export default function AdvisorLayout() {
  const { currentUser } = useAuth();
  const advisor = currentUser || {
    name: "Dr. Somchai Prasert",
    department: "Computer Science & IT",
    office: "Building 3, Room 412",
    adviseeCount: 28,
    pendingApprovalsCount: 3
  };

  return (
    <div className="portal-layout layout-advisor">
      {/* Advisor Sidebar */}
      <aside className="portal-sidebar" aria-label="Advisor Navigation">
        <div className="sidebar-top">
          <div className="sidebar-brand-box">
            <div className="brand-icon-box">
              <Briefcase size={22} />
            </div>
            <div>
              <div className="brand-title">Advisor Portal</div>
              <div className="brand-subtitle">Faculty Advising Center</div>
            </div>
          </div>

          <ul className="sidebar-menu">
            <li>
              <NavLink
                to="/advisor"
                end
                className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                id="advisor-nav-dashboard"
              >
                <LayoutDashboard size={18} />
                <span>Advisor Dashboard</span>
              </NavLink>
            </li>
            <li>
              <a href="#advisees" className="sidebar-link" onClick={(e) => e.preventDefault()}>
                <Users size={18} />
                <span>Advisee Directory</span>
              </a>
            </li>
            <li>
              <a href="#approvals" className="sidebar-link" onClick={(e) => e.preventDefault()}>
                <ClipboardCheck size={18} />
                <span>Course Approvals</span>
              </a>
            </li>
            <li>
              <a href="#consultations" className="sidebar-link" onClick={(e) => e.preventDefault()}>
                <MessageSquare size={18} />
                <span>Consultation Notes</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Advisor Bottom Card */}
        <div className="sidebar-bottom">
          <div className="sidebar-profile-card">
            <span className="profile-card-name">{advisor.name}</span>
            <span className="profile-card-detail">{advisor.department || "CS & IT"}</span>
            <span className="profile-card-detail">{advisor.office || "Office 412"}</span>
          </div>
        </div>
      </aside>

      {/* Main Advisor Portal Content */}
      <div className="portal-main">
        <header className="portal-header">
          <div className="header-left">
            <div>
              <div className="header-page-title">Faculty Advising Workspace</div>
              <div className="header-breadcrumbs">Home / Advisor / Dashboard</div>
            </div>
          </div>

          <div className="header-right">
            <div className="header-pill header-accent-badge">
              <AlertCircle size={14} />
              <span>{advisor.pendingApprovalsCount || 3} Approvals Pending</span>
            </div>

            <div className="user-avatar-tag">
              <div className="user-avatar-circle">
                <User size={16} />
              </div>
              <span>{advisor.name}</span>
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
