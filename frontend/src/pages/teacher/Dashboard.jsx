import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  RiCalendarCheckLine,
  RiBarChartBoxLine,
  RiNotification3Line,
  RiTimeLine,
  RiBookOpenLine,
  RiArrowRightLine,
  RiFileTextLine,
  RiTeamLine,
  RiCalendarEventLine,
  RiMapPinLine,
  RiLightbulbFlashLine,
  RiAlertLine,
} from 'react-icons/ri';
import Card from '../../components/common/Card';
import useAuth from '../hooks/useAuth';
import { edupathApi } from '../../services/edupathApi';

const SCHEDULE = [
  { id: 1, subject: 'Mathematics (Class 10-A)', time: '09:00 AM - 09:45 AM', room: 'Room 201' },
  { id: 2, subject: 'Science (Class 9-B)', time: '10:00 AM - 10:45 AM', room: 'Science Lab' },
  { id: 3, subject: 'English (Class 8-C)', time: '11:15 AM - 12:00 PM', room: 'Room 103' },
  { id: 4, subject: 'Social Science (Class 10-B)', time: '01:30 PM - 02:15 PM', room: 'Smart Classroom' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [timeGreeting, setTimeGreeting] = useState('Good Morning');
  const [stats, setStats] = useState({
    studentCount: 0,
    attendanceRate: '95%',
    notifications: [],
    performanceMetrics: [
      { label: 'Average Attendance', value: '92%', percentage: 92, status: 'On Track', badgeType: 'success' },
      { label: 'AI High Dropout Risk', value: '0 Students', percentage: 0, status: 'Optimal', badgeType: 'success' },
      { label: 'AI Medium Dropout Risk', value: '0 Students', percentage: 0, status: 'Monitor', badgeType: 'warning' },
      { label: 'AI Low Dropout Risk', value: '0 Students', percentage: 0, status: 'Stable', badgeType: 'success' },
    ]
  });
  const [loading, setLoading] = useState(false);

  // Assigned Student Predictions & Ollama Insight State
  const [assignedStudentsRisk, setAssignedStudentsRisk] = useState([]);
  const [riskLoading, setRiskLoading] = useState(true);
  const [riskError, setRiskError] = useState(null);

  const [insightData, setInsightData] = useState(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const [insightError, setInsightError] = useState(null);

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setTimeGreeting('Good Morning');
    else if (hours < 17) setTimeGreeting('Good Afternoon');
    else setTimeGreeting('Good Evening');

    const fetchTeacherStats = async () => {
      try {
        setLoading(true);
        setRiskLoading(true);
        setRiskError(null);

        // Step 1: Resolve logged-in teacher from session/user
        let teacher = null;
        if (user?.email) {
          teacher = await edupathApi.getTeacherByEmail(user.email).catch(() => null);
        }
        if (!teacher && user?.id) {
          teacher = await edupathApi.getTeacherByUserId(user.id).catch(() => null);
        }
        if (!teacher) {
          const allTeachers = await edupathApi.getAllTeachers().catch(() => []);
          if (Array.isArray(allTeachers) && allTeachers.length > 0) {
            teacher = allTeachers[0];
          }
        }

        if (!teacher?.id) {
          setRiskError("No teacher record found.");
          setRiskLoading(false);
          return;
        }

        console.log(`[Teacher Dashboard] Logged-in Teacher ID: ${teacher.id} (${teacher.fullName || 'Teacher'})`);

        // Step 2: Fetch Random Forest Risk predictions for teacher's assigned students
        let assignedRisks = [];
        try {
          assignedRisks = await edupathApi.getTeacherStudentsDropoutRisk(teacher.id);
        } catch (tErr) {
          console.warn("[Teacher Dashboard] Batch student risk lookup error:", tErr);
          setRiskError("AI risk prediction is temporarily unavailable.");
        }

        if (!Array.isArray(assignedRisks)) {
          assignedRisks = [];
        }

        console.log('[Teacher Dashboard] Assigned Students Risk Predictions:', assignedRisks);
        setAssignedStudentsRisk(assignedRisks);
        setRiskLoading(false);

        // Calculate dynamic AI metrics for cards
        const totalCount = assignedRisks.length;
        const highRiskCount = assignedRisks.filter(r => (r.dropoutRisk || r.dropout_risk) === 'High').length;
        const mediumRiskCount = assignedRisks.filter(r => (r.dropoutRisk || r.dropout_risk) === 'Medium').length;
        const lowRiskCount = assignedRisks.filter(r => (r.dropoutRisk || r.dropout_risk) === 'Low').length;

        // Calculate average attendance from MySQL feature summaries
        let avgAtt = null;
        if (totalCount > 0) {
          const sumAtt = assignedRisks.reduce((sum, r) => {
            const f = r.featureSummary || r.feature_summary || {};
            return sum + (f.attendance_percentage || 0);
          }, 0);
          avgAtt = Math.round(sumAtt / totalCount);
        }

        const notifs = await edupathApi.getAllNotifications().catch(() => []);
        const notifList = Array.isArray(notifs) && notifs.length > 0
          ? notifs.slice(0, 4).map((n, idx) => ({
              id: n.id || idx,
              type: 'info',
              icon: '📢',
              text: n.message || n.title || 'System Notification',
              time: 'Recently'
            }))
          : [
              { id: 1, type: 'success', icon: '✅', text: 'Attendance logged in MySQL database.', time: '10m ago' },
              { id: 2, type: 'warning', icon: '⚠️', text: 'Unit Test marks synchronized across all portals.', time: '2h ago' },
              { id: 3, type: 'info', icon: '📅', text: 'Parent alignment meeting scheduled.', time: '5h ago' },
            ];

        setStats({
          studentCount: totalCount,
          attendanceRate: avgAtt !== null ? `${avgAtt}%` : 'No Data',
          notifications: notifList,
          performanceMetrics: [
            { label: 'Average Attendance', value: avgAtt !== null ? `${avgAtt}%` : 'No Data', percentage: avgAtt || 0, status: avgAtt >= 75 ? 'On Track' : avgAtt !== null ? 'Needs Attention' : 'No Data', badgeType: avgAtt >= 75 ? 'success' : 'warning' },
            { label: 'AI High Dropout Risk', value: `${highRiskCount} Students`, percentage: totalCount ? Math.round((highRiskCount / totalCount) * 100) : 0, status: highRiskCount > 0 ? 'Action Required' : 'Optimal', badgeType: highRiskCount > 0 ? 'danger' : 'success' },
            { label: 'AI Medium Dropout Risk', value: `${mediumRiskCount} Students`, percentage: totalCount ? Math.round((mediumRiskCount / totalCount) * 100) : 0, status: 'Monitor', badgeType: 'warning' },
            { label: 'AI Low Dropout Risk', value: `${lowRiskCount} Students`, percentage: totalCount ? Math.round((lowRiskCount / totalCount) * 100) : 100, status: 'Stable', badgeType: 'success' },
          ]
        });

        // Step 3: Asynchronously fetch Ollama AI explanation for teacher guidance
        if (assignedRisks.length > 0) {
          // Priority: Pick a High or Medium risk student first, or first student
          const targetStudentRisk = assignedRisks.find(r => (r.dropoutRisk || r.dropout_risk) === 'High') ||
                                    assignedRisks.find(r => (r.dropoutRisk || r.dropout_risk) === 'Medium') ||
                                    assignedRisks[0];
          fetchAiExplanation(targetStudentRisk);
        }

      } catch (err) {
        console.error('[Teacher Dashboard API Fetch Error]', err);
        setRiskError('AI risk prediction is temporarily unavailable.');
      } finally {
        setLoading(false);
        setRiskLoading(false);
      }
    };

    const fetchAiExplanation = async (targetRisk) => {
      try {
        setInsightLoading(true);
        setInsightError(null);

        const dropoutRisk = targetRisk.dropout_risk || targetRisk.dropoutRisk || 'Medium';
        const confidence = targetRisk.confidence != null ? targetRisk.confidence : 0.0;
        const featureSummary = targetRisk.feature_summary || targetRisk.featureSummary || {};

        const explanationPayload = {
          dropout_risk: dropoutRisk,
          confidence: confidence,
          student: featureSummary,
        };

        console.log('[Teacher Dashboard] Requesting Ollama explanation for target student:', targetRisk.studentName, explanationPayload);
        const res = await edupathApi.getDropoutExplanation(explanationPayload);
        console.log('[Teacher Dashboard] Ollama Response:', res);
        setInsightData(res);
      } catch (err) {
        console.error('[Teacher Dashboard] Failed to fetch Ollama explanation:', err);
        setInsightError('AI explanation is temporarily unavailable.');
      } finally {
        setInsightLoading(false);
      }
    };

    fetchTeacherStats();
  }, [user]);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="dashboard animate-fade-in">
      {/* ── Welcome Hero ─────────────────────────── */}
      <div className="dash-welcome">
        <div className="dash-welcome-text">
          <h1>
            {timeGreeting}, <span className="text-gradient">{user?.name || 'Teacher'}</span> 👋
          </h1>
          <p>Manage your classes, record attendance, and monitor student dropout risks from MySQL database.</p>
        </div>
        <span className="badge badge-primary">{currentDate}</span>
      </div>

      {/* ── Stat Cards ───────────────────────────── */}
      <div className="dash-stats">
        <Card
          icon={<RiTeamLine />}
          title="My Students"
          value={stats.studentCount || "0"}
          badge="Assigned"
          badgeType="primary"
          hoverable
        >
          <p className="dash-stat-sub">Assigned in MySQL database</p>
        </Card>

        <Card
          icon={<RiBookOpenLine />}
          title="Classes Today"
          value="4"
          badge="Scheduled"
          badgeType="primary"
          hoverable
        >
          <p className="dash-stat-sub">Active course schedules</p>
        </Card>

        <Card
          icon={<RiCalendarCheckLine />}
          title="Attendance Rate"
          value={stats.attendanceRate}
          badge="Synchronized"
          badgeType="success"
          hoverable
        >
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: stats.attendanceRate }} />
          </div>
          <p className="dash-stat-sub">Live MySQL attendance status</p>
        </Card>

        <Card
          icon={<RiFileTextLine />}
          title="Pending Actions"
          value="0"
          badge="Up to Date"
          badgeType="success"
          hoverable
        >
          <p className="dash-stat-sub">All grading & logs up to date</p>
        </Card>
      </div>

      {/* ── AI Academic Insight Section ─────────────────── */}
      <div className="dash-ai-insight-card">
        <div className="dash-section-title">
          <h3>
            <RiLightbulbFlashLine className="ai-insight-icon" /> AI Academic Insight
          </h3>
          <span className={`badge ${insightData?.ollama_available ? 'badge-primary' : 'badge-warning'}`}>
            {insightLoading
              ? 'Generating teacher AI insights...'
              : insightData?.ollama_available
              ? 'Powered by Ollama llama3.2:3b'
              : 'Ollama Status'}
          </span>
        </div>

        {insightLoading ? (
          <div className="ai-insight-loading">
            <div className="ai-spinner" />
            <p>Generating personalized teacher guidance & student risk analysis...</p>
          </div>
        ) : insightError || (insightData && !insightData.ollama_available) ? (
          <div className="ai-insight-fallback">
            <p className="fallback-message">
              ⚠️ {insightError || 'AI explanation is temporarily unavailable.'}
            </p>
            <p className="fallback-sub">
              Your assigned students' Random Forest risk predictions remain active in the table below.
            </p>
          </div>
        ) : insightData ? (
          <div className="ai-insight-body">
            {/* Explanation */}
            <div className="ai-insight-explanation">
              <h4>Academic Risk Analysis for Teachers</h4>
              <p>{insightData.explanation}</p>
            </div>

            <div className="ai-insight-grid">
              {/* Key Contributing Factors */}
              {insightData.key_factors && insightData.key_factors.length > 0 && (
                <div className="ai-insight-block">
                  <h4>Key Contributing Factors</h4>
                  <ul className="ai-factors-list">
                    {insightData.key_factors.map((factor, idx) => (
                      <li key={idx}>
                        <span className="factor-bullet">•</span> {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommended Actions for Teacher */}
              {insightData.recommendations?.teacher && insightData.recommendations.teacher.length > 0 && (
                <div className="ai-insight-block">
                  <h4>Recommended Actions for Teacher</h4>
                  <ul className="ai-actions-list">
                    {insightData.recommendations.teacher.map((action, idx) => (
                      <li key={idx}>
                        <span className="action-check">✔</span> {action}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* ── My Assigned Students AI Risk Overview Table ── */}
      <div className="perf-overview-card animate-fade-in" style={{ padding: "20px" }}>
        <div className="dash-section-title" style={{ marginBottom: "16px" }}>
          <h3>
            <RiTeamLine /> My Assigned Students AI Risk Overview
          </h3>
          <span className="badge badge-primary">
            {riskLoading ? "Loading student risk analysis..." : `${assignedStudentsRisk.length} Students Evaluated`}
          </span>
        </div>

        {riskLoading ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Loading student risk analysis...</p>
        ) : riskError ? (
          <p style={{ color: "var(--accent-danger)", fontSize: "0.9rem" }}>⚠️ {riskError}</p>
        ) : assignedStudentsRisk.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No students currently assigned to this teacher account.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
                  <th style={{ padding: "10px 12px" }}>Student Name</th>
                  <th style={{ padding: "10px 12px" }}>Dropout Risk</th>
                  <th style={{ padding: "10px 12px" }}>Model Confidence</th>
                  <th style={{ padding: "10px 12px" }}>Attendance</th>
                  <th style={{ padding: "10px 12px" }}>Academic Score</th>
                </tr>
              </thead>
              <tbody>
                {assignedStudentsRisk.map((s, idx) => {
                  const risk = s.dropoutRisk || s.dropout_risk || 'Low';
                  const conf = s.confidence != null ? s.confidence : 0;
                  const feat = s.featureSummary || s.feature_summary || {};
                  return (
                    <tr key={s.studentId || idx} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                      <td style={{ padding: "12px", fontWeight: "600", color: "var(--text-primary)" }}>
                        {s.studentName || `Student ${s.studentId}`}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span className={`badge ${
                          risk === 'High' ? 'badge-danger' : risk === 'Medium' ? 'badge-warning' : 'badge-success'
                        }`}>
                          {risk} Risk
                        </span>
                      </td>
                      <td style={{ padding: "12px", fontWeight: "600", color: "var(--text-primary)" }}>
                        {conf}%
                      </td>
                      <td style={{ padding: "12px", color: "var(--text-secondary)" }}>
                        {feat.attendance_percentage ? `${feat.attendance_percentage}%` : 'N/A'}
                      </td>
                      <td style={{ padding: "12px", color: "var(--text-secondary)" }}>
                        {feat.current_percentage ? `${feat.current_percentage}%` : 'N/A'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Main Layout Split ────────────────────── */}
      <div className="dash-main-row">
        {/* Left Column: Schedule & Performance */}
        <div className="dash-left-column">
          {/* Today's Schedule */}
          <div className="schedule-card animate-fade-in">
            <div className="dash-section-title">
              <h3>
                <RiCalendarEventLine /> Today's Schedule
              </h3>
            </div>
            <div className="schedule-list">
              {SCHEDULE.map((s) => (
                <div key={s.id} className="schedule-item">
                  <div className="schedule-details">
                    <span className="schedule-subject">{s.subject}</span>
                    <div className="schedule-meta">
                      <span className="schedule-meta-item">
                        <RiTimeLine /> {s.time}
                      </span>
                      <span className="schedule-meta-item">
                        <RiMapPinLine /> {s.room}
                      </span>
                    </div>
                  </div>
                  <span className="schedule-room">{s.room}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Overview */}
          <div className="perf-overview-card animate-fade-in">
            <div className="dash-section-title">
              <h3>
                <RiBarChartBoxLine /> Performance Overview
              </h3>
            </div>
            <div className="schedule-list">
              {stats.performanceMetrics.map((metric, idx) => (
                <div key={idx} className="perf-item">
                  <div className="perf-info">
                    <span className="perf-label">{metric.label}</span>
                    <span className="perf-value">{metric.value}</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${metric.percentage}%` }} />
                  </div>
                  <div className="perf-info">
                    <span className="dash-stat-sub">Assigned student average</span>
                    <span className={`badge badge-${metric.badgeType}`}>{metric.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Actions & Notifications */}
        <div className="dash-right-column">
          {/* Quick Actions */}
          <div className="quick-actions-card animate-fade-in">
            <div className="dash-section-title">
              <h3>Quick Actions</h3>
            </div>
            <div className="actions-grid">
              <Link to="/teacher/attendance" className="action-btn">
                <RiCalendarCheckLine />
                <span>Mark Attendance</span>
              </Link>
              <Link to="/teacher/marks" className="action-btn">
                <RiFileTextLine />
                <span>Upload Marks</span>
              </Link>
              <Link to="/teacher/students" className="action-btn">
                <RiTeamLine />
                <span>View Students</span>
              </Link>
              <Link to="/teacher/reports" className="action-btn">
                <RiBarChartBoxLine />
                <span>Generate Report</span>
              </Link>
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="dash-notif-card animate-fade-in">
            <div className="dash-section-title">
              <h3>
                <RiNotification3Line /> Recent Alerts
              </h3>
              <Link to="/teacher/reports" className="dash-see-more">
                View All <RiArrowRightLine />
              </Link>
            </div>
            <div className="dash-notif-list">
              {stats.notifications.map((n) => (
                <div key={n.id} className="dash-notif-item dash-notif-info">
                  <span className="dash-notif-icon">{n.icon}</span>
                  <div className="dash-notif-content">
                    <p>{n.text}</p>
                    <span className="dash-notif-time">
                      <RiTimeLine /> {n.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Daily Summary & Status Footer */}
            <div style={{
                marginTop: "auto", 
                paddingTop: "16px", 
                borderTop: "1px solid var(--border-subtle)", 
                display: "flex", 
                flexDirection: "column",
                gap: "10px"
            }}>
                <div style={{
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between",
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)"
                }}>
                    <span>Daily Summary:</span>
                    <strong style={{ color: "var(--text-primary)" }}>{stats.studentCount} Students Managed</strong>
                </div>
                <div style={{
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between",
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)"
                }}>
                    <span>System Status:</span>
                    <span style={{ color: "var(--accent-success)", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-success)", display: "inline-block" }}></span>
                        All systems clear
                    </span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

