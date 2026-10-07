import React from "react";
import { useAuth } from "../context/useAuth";
import { STUDENT_ENROLLED_COURSES } from "../data/mockData";
import {
  GraduationCap,
  BookOpen,
  Calendar,
  Award,
  CheckCircle,
  Clock,
  Download,
  Search,
  MessageCircle
} from "lucide-react";

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const student = currentUser || {
    name: "Aung Kaung Myat",
    studentId: "2310030015",
    major: "Information Technology",
    year: "Year 3",
    advisor: "Dr. Somchai Prasert",
    currentTerm: "Semester 1 / 2026",
    maxCredits: 18,
    enrolledCredits: 15,
    gpa: "3.75"
  };

  const progressPercent = Math.round(((student.enrolledCredits || 15) / (student.maxCredits || 18)) * 100);

  return (
    <div className="student-dashboard" id="student-dashboard-view">
      {/* Welcome Banner */}
      <div className="welcome-card">
        <div className="welcome-info">
          <h1>Welcome, {student.name}</h1>
          <p>
            Student ID: <strong>{student.studentId || "2310030015"}</strong> • Major: <strong>{student.major || "Information Technology"}</strong> • Advisor: <strong>{student.advisor || "Dr. Somchai Prasert"}</strong>
          </p>
        </div>
        <div className="welcome-badge">
          <span className="badge badge-success">
            <CheckCircle size={14} />
            Registration Status: Cleared
          </span>
        </div>
      </div>

      {/* Quick Stat Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Enrolled Credits</span>
            <BookOpen size={18} className="stat-icon" />
          </div>
          <div className="stat-value">{student.enrolledCredits || 15} / {student.maxCredits || 18}</div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <div className="stat-subtext">{progressPercent}% of maximum limit utilized</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Total Courses</span>
            <GraduationCap size={18} className="stat-icon" />
          </div>
          <div className="stat-value">{STUDENT_ENROLLED_COURSES.length}</div>
          <div className="stat-subtext">5 theory & laboratory sections</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Cumulative GPA</span>
            <Award size={18} className="stat-icon" />
          </div>
          <div className="stat-value">{student.gpa || "3.75"}</div>
          <div className="stat-subtext">Good academic standing</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Term & Year</span>
            <Calendar size={18} className="stat-icon" />
          </div>
          <div className="stat-value">Fall 2026</div>
          <div className="stat-subtext">Regular registration period</div>
        </div>
      </div>

      {/* Registered Courses Table */}
      <div className="section-card">
        <div className="section-card-header">
          <div className="section-title">
            <BookOpen size={18} />
            <span>My Registered Courses (Fall 2026)</span>
          </div>
          <div className="section-actions">
            <button type="button" className="btn btn-sm btn-outline">
              <Download size={14} />
              <span>Export PDF</span>
            </button>
            <button type="button" className="btn btn-sm btn-primary-student">
              <Search size={14} />
              <span>Add / Drop Courses</span>
            </button>
          </div>
        </div>

        <div className="simple-table-wrapper">
          <table className="simple-table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Title</th>
                <th>Credits</th>
                <th>Section</th>
                <th>Instructor</th>
                <th>Schedule</th>
                <th>Room</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {STUDENT_ENROLLED_COURSES.map((course) => (
                <tr key={course.id}>
                  <td><strong>{course.code}</strong></td>
                  <td>{course.title}</td>
                  <td>{course.credits} cr</td>
                  <td><span className="badge badge-neutral">{course.section}</span></td>
                  <td>{course.instructor}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={13} className="text-muted" />
                      <span>{course.schedule}</span>
                    </div>
                  </td>
                  <td>{course.room}</td>
                  <td>
                    <span className="badge badge-success">
                      <CheckCircle size={12} />
                      {course.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Advisory & Support Notice */}
      <div className="section-card" style={{ background: "#f8fafc", borderStyle: "dashed" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.25rem" }}>
              Need advising or schedule assistance?
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Your assigned advisor is <strong>{student.advisor || "Dr. Somchai Prasert"}</strong> (Office hours: Mon & Thu 2:00 - 4:00 PM).
            </div>
          </div>
          <button type="button" className="btn btn-sm btn-outline">
            <MessageCircle size={14} />
            <span>Send Advisor Note</span>
          </button>
        </div>
      </div>
    </div>
  );
}
