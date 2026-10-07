import React, { useState } from "react";
import { useAuth } from "../context/useAuth";
import { ADMIN_METRICS, RECENT_OFFERINGS } from "../data/mockData";
import {
  Layers,
  Users,
  CalendarCheck,
  CheckCircle,
  AlertTriangle,
  Plus,
  Download,
  Server
} from "lucide-react";

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const admin = currentUser || {
    name: "Academic Registrar",
    role: "admin",
    office: "Office of the Registrar",
    systemStatus: "Healthy / Online"
  };

  const [windowOpen, setWindowOpen] = useState(ADMIN_METRICS.registrationWindowOpen);
  const [notice, setNotice] = useState("");

  const toggleWindow = () => {
    const nextState = !windowOpen;
    setWindowOpen(nextState);
    setNotice(
      nextState
        ? "Registration window is now OPEN for all student enrollments."
        : "Registration window is now CLOSED. Course changes are locked."
    );
    setTimeout(() => setNotice(""), 3500);
  };

  return (
    <div className="admin-dashboard" id="admin-dashboard-view">
      {/* Welcome Banner */}
      <div className="welcome-card">
        <div className="welcome-info">
          <h1>Registrar Console • Fall Semester 2026</h1>
          <p>
            Operating Account: <strong>{admin.name}</strong> • Division: <strong>{admin.office || "Office of the Registrar"}</strong>
          </p>
        </div>
        <div className="welcome-badge">
          <span className="badge badge-success">
            <Server size={14} />
            System Status: 100% Operational
          </span>
        </div>
      </div>

      {notice && (
        <div
          style={{
            marginBottom: "1.25rem",
            padding: "0.75rem 1rem",
            background: windowOpen ? "#ecfdf5" : "#fef2f2",
            color: windowOpen ? "#065f46" : "#991b1b",
            borderRadius: "var(--radius-md)",
            border: `1px solid ${windowOpen ? "#a7f3d0" : "#fecaca"}`,
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          {windowOpen ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
          <span>{notice}</span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Total Active Students</span>
            <Users size={18} className="stat-icon" />
          </div>
          <div className="stat-value">{ADMIN_METRICS.totalStudents.toLocaleString()}</div>
          <div className="stat-subtext">Registered degree candidates</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Active Course Sections</span>
            <Layers size={18} className="stat-icon" />
          </div>
          <div className="stat-value">{ADMIN_METRICS.activeOfferings}</div>
          <div className="stat-subtext">Across 6 academic divisions</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Total Course Enrollments</span>
            <CalendarCheck size={18} className="stat-icon" />
          </div>
          <div className="stat-value">{ADMIN_METRICS.totalRegistrations.toLocaleString()}</div>
          <div className="stat-subtext">Average 3.97 courses/student</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Pending Faculty Signatures</span>
            <AlertTriangle size={18} className="stat-icon" />
          </div>
          <div className="stat-value" style={{ color: "#d97706" }}>
            {ADMIN_METRICS.pendingApprovals}
          </div>
          <div className="stat-subtext">Prerequisite override requests</div>
        </div>
      </div>

      {/* Registration Period Control Bar */}
      <div className="section-card">
        <div className="section-card-header">
          <div className="section-title">
            <CalendarCheck size={18} />
            <span>Registration Window Configuration</span>
          </div>
          <div className="section-actions">
            <button
              type="button"
              className={`btn btn-sm ${windowOpen ? "btn-danger" : "btn-success"}`}
              onClick={toggleWindow}
              id="btn-toggle-registration-window"
            >
              {windowOpen ? "Close Registration Window" : "Open Registration Window"}
            </button>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>
              Current Window Status:{" "}
              {windowOpen ? (
                <span className="badge badge-success">OPEN FOR REGISTRATION</span>
              ) : (
                <span className="badge badge-danger">CLOSED (READ ONLY)</span>
              )}
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Official Drop/Add Deadline: <strong>{ADMIN_METRICS.windowDeadline}</strong>
            </div>
          </div>
          <div style={{ fontSize: "0.8125rem", color: "var(--text-light)" }}>
            * Modifying the registration window updates enrollment permissions globally in real-time.
          </div>
        </div>
      </div>

      {/* Section Capacity & Enrollment Overview */}
      <div className="section-card">
        <div className="section-card-header">
          <div className="section-title">
            <Layers size={18} />
            <span>Active Course Offerings & Capacity Monitor</span>
          </div>
          <div className="section-actions">
            <button type="button" className="btn btn-sm btn-outline">
              <Download size={14} />
              <span>Export Roster</span>
            </button>
            <button type="button" className="btn btn-sm btn-primary-admin">
              <Plus size={14} />
              <span>New Section Offering</span>
            </button>
          </div>
        </div>

        <div className="simple-table-wrapper">
          <table className="simple-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Course Name</th>
                <th>Assigned Faculty</th>
                <th>Capacity</th>
                <th>Enrolled</th>
                <th>Enrollment Load</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_OFFERINGS.map((item) => {
                const loadPercent = Math.round((item.enrolled / item.capacity) * 100);
                return (
                  <tr key={item.id}>
                    <td><strong>{item.code}</strong></td>
                    <td>{item.title}</td>
                    <td>{item.instructor}</td>
                    <td>{item.capacity} seats</td>
                    <td><strong>{item.enrolled}</strong></td>
                    <td style={{ minWidth: "140px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div className="progress-bar-container" style={{ flex: 1, margin: 0 }}>
                          <div
                            className="progress-bar-fill"
                            style={{
                              width: `${loadPercent}%`,
                              backgroundColor: loadPercent >= 100 ? "#dc2626" : "#4f46e5"
                            }}
                          ></div>
                        </div>
                        <span style={{ fontSize: "0.75rem", minWidth: "32px", textAlign: "right" }}>
                          {loadPercent}%
                        </span>
                      </div>
                    </td>
                    <td>
                      {item.status === "Full" ? (
                        <span className="badge badge-danger">Capacity Full</span>
                      ) : (
                        <span className="badge badge-success">Open Seats</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
