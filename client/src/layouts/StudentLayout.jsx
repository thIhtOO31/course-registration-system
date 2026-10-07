import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Calendar,
  Award,
  User,
  CheckCircle
} from "lucide-react";

export default function StudentLayout() {
  const { currentUser } = useAuth();
  const student = currentUser || {
    name: "Aung Kaung Myat",
    studentId: "2310030015",
    major: "Information Technology",
    advisor: "Dr. Somchai Prasert",
    enrolledCredits: 15,
    maxCredits: 18
  };

  return (
    <div className="portal-layout layout-student">
      {/* Student Sidebar */}
      <aside className="portal-sidebar" aria-label="Student Navigation">
        <div className="sidebar-top">
          <div className="sidebar-brand-box">
            <div className="brand-icon-box">
              <GraduationCap size={22} />
            </div>
            <div>
              <div className="brand-title">Student Portal</div>
              <div className="brand-subtitle">Registration & Academics</div>
            </div>
          </div>

          <ul className="sidebar-menu">
            <li>
              <NavLink
                to="/student"
                end
                className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                id="student-nav-dashboard"
              >
                <LayoutDashboard size={18} />
                <span>My Dashboard</span>
              </NavLink>
            </li>
            <li>
              <a href="#register" className="sidebar-link" onClick={(e) => e.preventDefault()}>
                <BookOpen size={18} />
                <span>Course Catalog</span>
              </a>
            </li>
            <li>
              <a href="#schedule" className="sidebar-link" onClick={(e) => e.preventDefault()}>
                <Calendar size={18} />
                <span>Class Schedule</span>
              </a>
            </li>
            <li>
              <a href="#record" className="sidebar-link" onClick={(e) => e.preventDefault()}>
                <Award size={18} />
                <span>Academic Record</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Student Bottom Card */}
        <div className="sidebar-bottom">
          <div className="sidebar-profile-card">
            <span className="profile-card-name">{student.name}</span>
            <span className="profile-card-detail">ID: {student.studentId || "2310030015"}</span>
            <span className="profile-card-detail">{student.major || "Info Tech"}</span>
          </div>
        </div>
      </aside>

      {/* Main Student Portal Content */}
      <div className="portal-main">
        <header className="portal-header">
          <div className="header-left">
            <div>
              <div className="header-page-title">Student Academic Center</div>
              <div className="header-breadcrumbs">Home / Student / Dashboard</div>
            </div>
          </div>

          <div className="header-right">
            <div className="header-pill header-accent-badge">
              <CheckCircle size={14} />
              <span>{student.enrolledCredits || 15} / {student.maxCredits || 18} Credits</span>
            </div>

            <div className="user-avatar-tag">
              <div className="user-avatar-circle">
                <User size={16} />
              </div>
              <span>{student.name}</span>
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
