import React, { useState, useEffect } from 'react';
import { RiCalendarCheckLine } from 'react-icons/ri';
import { edupathApi } from '../../services/edupathApi';
import useAuth from '../hooks/useAuth';
import './StudentPage.css';

const getStatusClass = (pct) => {
  if (pct >= 85) return 'status-high';
  if (pct >= 75) return 'status-medium';
  return 'status-low';
};

const getStatusLabel = (pct) => {
  if (pct >= 85) return 'Excellent';
  if (pct >= 75) return 'Good';
  return 'Low ⚠️';
};

const Attendance = () => {
  const { user } = useAuth();
  const [attendanceData, setAttendanceData] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealAttendance = async () => {
      try {
        setLoading(true);
        let student = null;
        if (user?.email) {
          student = await edupathApi.getStudentByEmail(user.email).catch(() => null);
        }
        if (!student && user?.id) {
          student = await edupathApi.getStudentByUserId(user.id).catch(() => null);
        }
        if (!student) {
          const allStuds = await edupathApi.getAllStudents().catch(() => []);
          if (Array.isArray(allStuds) && allStuds.length > 0) {
            student = allStuds[0];
          }
        }

        if (student?.id) {
          const [subjList, summaryRes] = await Promise.all([
            edupathApi.getStudentSubjectAttendance(student.id).catch(() => []),
            edupathApi.getStudentAttendanceSummary(student.id).catch(() => null),
          ]);

          if (Array.isArray(subjList)) {
            setAttendanceData(subjList);
          }
          if (summaryRes) {
            setSummaryData(summaryRes);
          }
        }
      } catch (err) {
        console.error('[Student Attendance API Fetch Error]', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRealAttendance();
  }, [user]);

  const totalPresent = summaryData?.presentDays ?? attendanceData.reduce((s, a) => s + a.present, 0);
  const totalClasses = summaryData?.totalDays ?? attendanceData.reduce((s, a) => s + a.total, 0);
  const overall = summaryData?.attendancePercentage ?? (totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0);

  return (
    <div className="student-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-icon" style={{ background: 'var(--gradient-primary)' }}>
          <RiCalendarCheckLine />
        </div>
        <div>
          <h2 className="page-title">Attendance</h2>
          <p className="page-subtitle">Track your subject-wise attendance from MySQL and ensure you meet the 75% minimum.</p>
        </div>
      </div>

      {/* Overall Cards */}
      <div className="att-overview">
        <div className="att-overview-card att-total">
          <p className="att-ov-label">Overall Attendance</p>
          <p className="att-ov-value">{loading ? '...' : `${overall}%`}</p>
          <div className="progress-bar-container" style={{ marginTop: '12px' }}>
            <div className="progress-bar-fill" style={{ width: `${overall}%` }} />
          </div>
          <p className="att-ov-sub">
            Total: {totalPresent} / {totalClasses} classes attended
          </p>
        </div>
        <div className="att-overview-card att-req">
          <p className="att-ov-label">Minimum Required</p>
          <p className="att-ov-value" style={{ color: 'var(--accent-amber, #F59E0B)' }}>75%</p>
          <p className="att-ov-sub" style={{ marginTop: '12px' }}>
            {overall >= 75
              ? `✅ You're safe by ${Math.round((overall - 75) * 10) / 10}% margin`
              : `⚠️ You need ${Math.round((75 - overall) * 10) / 10}% more attendance`}
          </p>
        </div>
        <div className="att-overview-card att-low">
          <p className="att-ov-label">Subjects Below 75%</p>
          <p className="att-ov-value" style={{ color: 'var(--accent-danger, #DC2626)' }}>
            {attendanceData.filter((s) => s.percentage < 75).length}
          </p>
          <p className="att-ov-sub" style={{ marginTop: '12px' }}>
            {attendanceData.filter((s) => s.percentage < 75)
              .map((s) => s.subject.split(' ')[0])
              .join(', ') || 'None — Great!'}
          </p>
        </div>
      </div>

      {/* Subject Table */}
      <div className="page-card">
        <h4 className="profile-section-title">Subject-wise Attendance</h4>
        {loading ? (
          <p style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading attendance records from database...</p>
        ) : attendanceData.length === 0 ? (
          <p style={{ padding: '20px', color: 'var(--text-secondary)' }}>No subject attendance records found in database.</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Subject</th>
                  <th>Classes Attended</th>
                  <th>Total Classes</th>
                  <th>Percentage</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((row, i) => (
                  <tr key={row.subject + i}>
                    <td>{i + 1}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{row.subject}</td>
                    <td>{row.present}</td>
                    <td>{row.total}</td>
                    <td>
                      <div className="att-cell">
                        <span className={`att-pct-text ${getStatusClass(row.percentage)}`}>
                          {row.percentage}%
                        </span>
                        <div className="att-mini-bar">
                          <div
                            className={`att-mini-fill ${getStatusClass(row.percentage)}`}
                            style={{ width: `${Math.min(row.percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`att-status ${getStatusClass(row.percentage)}`}>
                        {getStatusLabel(row.percentage)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;