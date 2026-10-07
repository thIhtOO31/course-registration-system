import React, { useState } from "react";
import { useAuth } from "../context/useAuth";
import { ADVISOR_PENDING_REQUESTS } from "../data/mockData";
import {
  Users,
  ClipboardCheck,
  CheckCircle,
  XCircle,
  Clock,
  Check,
  AlertCircle
} from "lucide-react";

export default function AdvisorDashboard() {
  const { currentUser } = useAuth();
  const advisor = currentUser || {
    name: "Dr. Somchai Prasert",
    department: "Computer Science & IT",
    office: "Building 3, Room 412",
    adviseeCount: 28,
    pendingApprovalsCount: 3
  };

  const [requests, setRequests] = useState(ADVISOR_PENDING_REQUESTS);
  const [notification, setNotification] = useState("");

  const handleAction = (id, newStatus) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
    );
    setNotification(`Request ${id} marked as ${newStatus}.`);
    setTimeout(() => setNotification(""), 3500);
  };

  const pendingCount = requests.filter((r) => r.status === "Pending").length;

  return (
    <div className="advisor-dashboard" id="advisor-dashboard-view">
      {/* Welcome Banner */}
      <div className="welcome-card">
        <div className="welcome-info">
          <h1>Welcome, {advisor.name}</h1>
          <p>
            Department of <strong>{advisor.department || "Computer Science & IT"}</strong> • Office: <strong>{advisor.office || "Building 3, Room 412"}</strong>
          </p>
        </div>
        <div className="welcome-badge">
          <span className="badge badge-warning">
            <AlertCircle size={14} />
            {pendingCount} Pending Approval{pendingCount === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {notification && (
        <div
          style={{
            marginBottom: "1.25rem",
            padding: "0.75rem 1rem",
            background: "#ecfdf5",
            color: "#065f46",
            borderRadius: "var(--radius-md)",
            border: "1px solid #a7f3d0",
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <Check size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* Quick Stat Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Assigned Advisees</span>
            <Users size={18} className="stat-icon" />
          </div>
          <div className="stat-value">{advisor.adviseeCount || 28}</div>
          <div className="stat-subtext">Active undergraduate students</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Pending Action</span>
            <Clock size={18} className="stat-icon" />
          </div>
          <div className="stat-value" style={{ color: pendingCount > 0 ? "#d97706" : "#059669" }}>
            {pendingCount}
          </div>
          <div className="stat-subtext">Require advisor signature</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Cleared Registrations</span>
            <ClipboardCheck size={18} className="stat-icon" />
          </div>
          <div className="stat-value">25</div>
          <div className="stat-subtext">89% completion rate</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Upcoming Office Hours</span>
            <Clock size={18} className="stat-icon" />
          </div>
          <div className="stat-value" style={{ fontSize: "1.25rem" }}>Mon 2:00 PM</div>
          <div className="stat-subtext">Room 412 / Hybrid zoom link</div>
        </div>
      </div>

      {/* Pending Course Registration Approvals Table */}
      <div className="section-card">
        <div className="section-card-header">
          <div className="section-title">
            <ClipboardCheck size={18} />
            <span>Course Registration & Prerequisite Clearance Requests</span>
          </div>
          <div className="section-actions">
            <span className="badge badge-neutral">Fall 2026 Term</span>
          </div>
        </div>

        <div className="simple-table-wrapper">
          <table className="simple-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Student ID</th>
                <th>Course Requested</th>
                <th>Credits</th>
                <th>Reason / Justification</th>
                <th>Date</th>
                <th>Status</th>
                <th>Decision</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td><strong>{req.studentName}</strong></td>
                  <td>{req.studentId}</td>
                  <td>
                    <div><strong>{req.courseCode}</strong></div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{req.courseTitle}</div>
                  </td>
                  <td>{req.credits} cr</td>
                  <td style={{ maxWidth: "260px" }}>
                    <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                      {req.reason}
                    </span>
                  </td>
                  <td>{req.requestDate}</td>
                  <td>
                    {req.status === "Pending" ? (
                      <span className="badge badge-warning">Pending Review</span>
                    ) : req.status === "Approved" ? (
                      <span className="badge badge-success">Approved</span>
                    ) : (
                      <span className="badge badge-danger">Rejected</span>
                    )}
                  </td>
                  <td>
                    {req.status === "Pending" ? (
                      <div style={{ display: "flex", gap: "0.35rem" }}>
                        <button
                          type="button"
                          className="btn btn-sm btn-success"
                          onClick={() => handleAction(req.id, "Approved")}
                        >
                          <CheckCircle size={13} />
                          <span>Approve</span>
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => handleAction(req.id, "Rejected")}
                        >
                          <XCircle size={13} />
                          <span>Reject</span>
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        Completed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
