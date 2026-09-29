import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
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
  RiSunLine,
  RiUserVoiceLine,
  RiMailSendLine,
  RiErrorWarningLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiLightbulbFlashLine,
} from "react-icons/ri";


import Card from "../../components/common/Card";
import useAuth from "../hooks/useAuth";
import { edupathApi } from "../../services/edupathApi";
import "./AdminDashboard.css";

const PIE_COLORS = ["#75070C", "#FFEDAB"];

const ALERTS = [
  {
    id: 1,
    priority: "high",
    category: "Homework Deadline",
    text: "Mathematics Homework submission window closes in 4 hours. 28 students pending.",
    time: "10m ago",
    icon: "⚠️",
  },
  {
    id: 2,
    priority: "medium",
    category: "Parent Meeting",
    text: "Parent consultation scheduled for Friday 3 PM.",
    time: "2h ago",
    icon: "📅",
  },
  {
    id: 3,
    priority: "low",
    category: "Report Generated",
    text: "Weekly school dropout risk analytics CSV report is ready for download.",
    time: "1d ago",
    icon: "🏆",
  },
];

const PERFORMANCE_LEVELS = [
  { label: "Excellent", count: 0, fillClass: "excellent", percentage: 0 },
  { label: "Good", count: 0, fillClass: "good", percentage: 0 },
  { label: "Average", count: 0, fillClass: "average", percentage: 0 },
  { label: "Needs Attention", count: 0, fillClass: "danger", percentage: 0 },
];

const TOP_STUDENTS = [];
const AT_RISK_STUDENTS = [];
const TIMELINE_SCHEDULE = [];

// ────────────────────────────────────────────────────────────────────────────

const Dashboard = () => {
  const { user } = useAuth();
  const [timeGreeting, setTimeGreeting] = useState("Good Morning");
  const [liveTime, setLiveTime] = useState("");
  const [atRiskList, setAtRiskList] = useState([]);
  const [aiSummary, setAiSummary] = useState(null);
  const [counts, setCounts] = useState({
    students: "0",
    teachers: "0",
    attendance: "0%",
    sessions: "0"
  });

  // Admin All Student Risk & Ollama Insight State
  const [allStudentsRisk, setAllStudentsRisk] = useState([]);
  const [topStudentsList, setTopStudentsList] = useState([]);
  const [deptBarData, setDeptBarData] = useState([]);
  const [growthChartData, setGrowthChartData] = useState([]);
  const [growthHasHistory, setGrowthHasHistory] = useState(false);
  const [perfChartData, setPerfChartData] = useState([]);
  const [attendancePieData, setAttendancePieData] = useState([]);
  const [perfLevels, setPerfLevels] = useState(PERFORMANCE_LEVELS);
  const [academicSummary, setAcademicSummary] = useState({
    totalGraded: 50,
    avgScore: "76.4%",
    atRiskCount: 16
  });
  const [riskLoading, setRiskLoading] = useState(true);
  const [riskError, setRiskError] = useState(null);

  const [insightData, setInsightData] = useState(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const [insightError, setInsightError] = useState(null);

  useEffect(() => {
    // Determine greeting
    const hours = new Date().getHours();
    if (hours < 12) setTimeGreeting("Good Morning");
    else if (hours < 17) setTimeGreeting("Good Afternoon");
    else setTimeGreeting("Good Evening");

    // Clock update
    const updateTime = () => {
      const now = new Date();
      setLiveTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    const fetchAdminStats = async () => {
      try {
        setRiskLoading(true);
        setRiskError(null);

        // Fetch all student risk predictions via Random Forest batch API
        let adminRisks = [];
        try {
          adminRisks = await edupathApi.getAdminStudentsDropoutRisk();
        } catch (rErr) {
          console.warn("[Admin Dashboard] Batch student risk lookup error:", rErr);
          setRiskError("AI risk analysis unavailable");
        }

        if (!Array.isArray(adminRisks)) {
          adminRisks = [];
        }

        console.log('[Admin Dashboard] Admin Batch Students Risk Predictions:', adminRisks);
        setAllStudentsRisk(adminRisks);
        setRiskLoading(false);

        // Sort students so HIGH risk comes first, then MEDIUM, then LOW
        const riskOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
        const sortedAtRisk = [...adminRisks].sort((a, b) => {
          const rA = riskOrder[a.dropoutRisk || a.dropout_risk] || 4;
          const rB = riskOrder[b.dropoutRisk || b.dropout_risk] || 4;
          if (rA !== rB) return rA - rB;
          return (b.confidence || 0) - (a.confidence || 0);
        });

        const formattedAtRiskList = sortedAtRisk.map(s => {
          const risk = s.dropoutRisk || s.dropout_risk || 'Low';
          const conf = s.confidence != null ? s.confidence : 0;
          const feat = s.featureSummary || s.feature_summary || {};
          return {
            id: s.studentId,
            name: s.studentName,
            dept: `Class ${feat.grade || '10'} • ${risk} Risk`,
            metric: `${risk} Risk (${conf}% Conf)`,
            risk: risk,
            confidence: conf,
            attendance: feat.attendance_percentage || 0,
            academic: feat.current_percentage || 0,
            status: risk === 'High' ? 'danger' : risk === 'Medium' ? 'warning' : 'success'
          };
        });
        setAtRiskList(formattedAtRiskList);

        // Top Performing Students sorted by current_percentage / academic score
        const sortedTop = [...adminRisks].sort((a, b) => {
          const fA = a.featureSummary || a.feature_summary || {};
          const fB = b.featureSummary || b.feature_summary || {};
          return (fB.current_percentage || 0) - (fA.current_percentage || 0);
        });

        const formattedTopList = sortedTop.slice(0, 5).map(s => {
          const feat = s.featureSummary || s.feature_summary || {};
          return {
            id: s.studentId,
            name: s.studentName,
            dept: `Class ${feat.grade || '10'}`,
            metric: `${feat.current_percentage ? `${feat.current_percentage}% Marks` : 'High Marks'}`,
            status: 'high'
          };
        });
        if (formattedTopList.length > 0) {
          setTopStudentsList(formattedTopList);
        }

        // Aggregate summary metrics
        const totalStuds = adminRisks.length;
        const highRiskCount = adminRisks.filter(r => (r.dropoutRisk || r.dropout_risk) === 'High').length;
        const mediumRiskCount = adminRisks.filter(r => (r.dropoutRisk || r.dropout_risk) === 'Medium').length;
        const lowRiskCount = adminRisks.filter(r => (r.dropoutRisk || r.dropout_risk) === 'Low').length;

        const summaryObj = {
          total_students: totalStuds,
          high_risk: highRiskCount,
          medium_risk: mediumRiskCount,
          low_risk: lowRiskCount,
        };
        setAiSummary(summaryObj);

        const students = await edupathApi.getAllStudents().catch(() => []);
        const teachers = await edupathApi.getAllTeachers().catch(() => []);
        const attendance = await edupathApi.getAllAttendance().catch(() => []);
        const sessions = await edupathApi.getAllCounselingSessions().catch(() => []);

        let attRate = "No Data";
        if (Array.isArray(attendance) && attendance.length > 0) {
          const present = attendance.filter(a => {
            const st = a.status?.toLowerCase() || '';
            return st === 'present' || st === 'p';
          }).length;
          attRate = `${Math.round((present / attendance.length) * 100)}%`;
        }

        setCounts({
          students: String(totalStuds || (Array.isArray(students) ? students.length : 0)),
          teachers: String(Array.isArray(teachers) ? teachers.length : 0),
          attendance: attRate,
          sessions: String(Array.isArray(sessions) ? sessions.length : 0),
        });

        // Fetch 4 dynamic Admin Dashboard chart datasets from backend APIs
        edupathApi.getAdminStudentGrowth()
          .then(res => {
            setGrowthChartData(res?.growthData || []);
            setGrowthHasHistory(Boolean(res?.hasHistoricalData));
          })
          .catch(err => console.error('[Admin Dashboard] Student Growth API error:', err));

        edupathApi.getAdminGradeDistribution()
          .then(res => {
            if (res?.gradeData && res.gradeData.length > 0) {
              setDeptBarData(res.gradeData);
            }
          })
          .catch(err => console.error('[Admin Dashboard] Grade Distribution API error:', err));

        edupathApi.getAdminPerformanceAverage()
          .then(res => setPerfChartData(res?.performanceData || []))
          .catch(err => console.error('[Admin Dashboard] Performance Average API error:', err));

        edupathApi.getAdminAttendanceDistribution()
          .then(res => setAttendancePieData(res?.pieData || []))
          .catch(err => console.error('[Admin Dashboard] Attendance Distribution API error:', err));

        // Compute Performance Levels dynamically from student risk feature summaries
        if (adminRisks.length > 0) {
          let exc = 0, gd = 0, avg = 0, att = 0;
          let totalScoreSum = 0;
          let totalScoreCount = 0;
          let atRiskIntervention = 0;

          adminRisks.forEach(r => {
            const feat = r.featureSummary || r.feature_summary || {};
            const score = feat.current_percentage || 0;
            if (score > 0) {
              totalScoreSum += score;
              totalScoreCount++;
            }
            if (score >= 85) exc++;
            else if (score >= 70) gd++;
            else if (score >= 50) avg++;
            else att++;

            const risk = r.dropoutRisk || r.dropout_risk;
            if (risk === 'High' || risk === 'Medium') {
              atRiskIntervention++;
            }
          });
          const totalScored = exc + gd + avg + att;
          if (totalScored > 0) {
            setPerfLevels([
              { label: "Excellent (≥85%)", count: exc, fillClass: "excellent", percentage: Math.round((exc / totalScored) * 100) },
              { label: "Good (70-84%)", count: gd, fillClass: "good", percentage: Math.round((gd / totalScored) * 100) },
              { label: "Average (50-69%)", count: avg, fillClass: "average", percentage: Math.round((avg / totalScored) * 100) },
              { label: "Needs Attention (<50%)", count: att, fillClass: "danger", percentage: Math.round((att / totalScored) * 100) },
            ]);
            setAcademicSummary({
              totalGraded: adminRisks.length,
              avgScore: totalScoreCount > 0 ? (totalScoreSum / totalScoreCount).toFixed(1) + '%' : '0%',
              atRiskCount: atRiskIntervention
            });
          }
        }

        // Asynchronously fetch Ollama AI explanation for institutional insights
        if (adminRisks.length > 0) {
          const targetStudentRisk = adminRisks.find(r => (r.dropoutRisk || r.dropout_risk) === 'High') ||
                                    adminRisks.find(r => (r.dropoutRisk || r.dropout_risk) === 'Medium') ||
                                    adminRisks[0];
          fetchAiExplanation(targetStudentRisk);
        }

      } catch (err) {
        console.error("[Admin Dashboard API Fetch Error]", err);
        setRiskError("AI risk analysis unavailable");
      } finally {
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

        console.log('[Admin Dashboard] Requesting Ollama explanation for target student:', targetRisk.studentName, explanationPayload);
        const res = await edupathApi.getDropoutExplanation(explanationPayload);
        console.log('[Admin Dashboard] Ollama Response:', res);
        setInsightData(res);
      } catch (err) {
        console.error('[Admin Dashboard] Failed to fetch Ollama explanation:', err);
        setInsightError('AI explanation is temporarily unavailable.');
      } finally {
        setInsightLoading(false);
      }
    };

    fetchAdminStats();

    return () => clearInterval(interval);
  }, []);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="admin-dashboard animate-fade-in">
      {/* ── 1. Header ───────────────────────────────────── */}
      <div className="admin-welcome-hero">
        <div className="admin-welcome-left">
          <h1>
            {timeGreeting}, <span className="text-gradient">{user?.name || "Admin"}</span> 👋
          </h1>
          <p>
            Welcome back! Here's an overview of today's academic activities, student analytics, attendance status, and institutional insights from MySQL database.
          </p>
        </div>

        <div className="admin-welcome-widgets">
          <div className="widget-item">
            <span className="widget-icon">📅</span>
            <span>{currentDate}</span>
          </div>
          <div className="widget-item">
            <span className="widget-icon">⏰</span>
            <span>{liveTime}</span>
          </div>
          <div className="widget-item">
            <RiSunLine className="widget-icon" />
            <span>Sunny, 24°C</span>
          </div>
          <div className="widget-item">
            <RiNotification3Line className="widget-icon" />
            <span>MySQL Live</span>
          </div>
          <div className="widget-avatar" title="View Profile">
            {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
          </div>
        </div>
      </div>

      {/* ── 2. Dashboard Stat Cards ───────────────────────── */}
      <div className="dash-stats">
        <Card
          icon={<RiTeamLine />}
          title="Total Enrolled Students"
          value={counts.students}
          badge="Active"
          badgeType="success"
          hoverable
        >
          <p className="dash-stat-sub">Across Classes 6–12</p>
        </Card>

        <Card
          icon={<RiUserVoiceLine />}
          title="Active Instructors"
          value={counts.teachers}
          badge="Verified"
          badgeType="primary"
          hoverable
        >
          <p className="dash-stat-sub">Instructors registered in database</p>
        </Card>

        <Card
          icon={<RiCalendarCheckLine />}
          title="Institutional Attendance"
          value={counts.attendance}
          badge="On Track"
          badgeType="success"
          hoverable
        >
          <p className="dash-stat-sub">Weekly average safety threshold</p>
        </Card>

        <Card
          icon={<RiBarChartBoxLine />}
          title="Counseling Sessions"
          value={counts.sessions}
          badge="Active"
          badgeType="warning"
          hoverable
        >
          <p className="dash-stat-sub">Counselor reviews in database</p>
        </Card>
      </div>

      {/* ── 3. Charts Section (Recharts) ────────────────── */}
      <div className="chart-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Student Growth Trend</h3>
            <span className="badge badge-primary">Area Chart</span>
          </div>
          <div className="chart-container">
            {growthHasHistory && growthChartData.length >= 2 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthChartData}>
                  <defs>
                    <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#75070C" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#75070C" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} />
                  <Tooltip />
                  <Area type="monotone" dataKey="students" stroke="#75070C" fillOpacity={1} fill="url(#colorGrowth)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center' }}>
                No historical growth data recorded
              </div>
            )}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Grade Level Student Distribution</h3>
            <span className="badge badge-primary">Bar Chart</span>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptBarData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip />
                <Bar dataKey="students" fill="#75070C" radius={[4, 4, 0, 0]}>
                  {deptBarData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#75070C" : "#991c21"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Subject Performance Average</h3>
            <span className="badge badge-primary">Line Chart</span>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={perfChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="average" stroke="#75070C" strokeWidth={3} dot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Daily Attendance Distribution</h3>
            <span className="badge badge-primary">Pie Chart</span>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendancePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {attendancePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── 4. Main Split: Schedule & Performance ────────── */}
      <div className="dash-main-row">
        {/* Left Column */}
        <div className="dash-left-column">
          {/* Today's Schedule */}
          <div className="schedule-card">
            <div className="dash-section-title">
              <h3>
                <RiCalendarEventLine /> Today's Schedule
              </h3>
            </div>
            <div className="timeline-schedule">
              {TIMELINE_SCHEDULE.length > 0 ? (
                TIMELINE_SCHEDULE.map((item) => (
                  <div key={item.id} className="timeline-item">
                    <div className="timeline-time">{item.time}</div>
                    <div className={`timeline-indicator ${item.status}`} />
                    <div className="timeline-card">
                      <div className="timeline-info">
                        <h4>{item.subject}</h4>
                        <div className="timeline-meta">
                          <span>Teacher: {item.teacher}</span>
                          <span>
                            <RiMapPinLine /> {item.room}
                          </span>
                        </div>
                      </div>
                      <span className={`badge badge-${item.status === "completed" ? "success" : item.status === "current" ? "primary" : "warning"}`}>
                        {item.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: "16px", color: "var(--text-muted, #666)", textAlign: "center", fontSize: "14px" }}>
                  No classes or events scheduled for today.
                </div>
              )}
            </div>
          </div>

          {/* Performance Overview */}
          <div className="perf-overview-card">
            <div className="dash-section-title">
              <h3>
                <RiBarChartBoxLine /> Academic Grade Distribution
              </h3>
            </div>
            <div className="perf-bar-list">
              {perfLevels.map((item, idx) => (
                <div key={idx} className="perf-bar-item">
                  <div className="perf-bar-header">
                    <span className="perf-bar-label">{item.label} ({item.count} students)</span>
                    <span className="perf-bar-value">{item.percentage}%</span>
                  </div>
                  <div className="mini-bar-track">
                    <div className={`mini-bar-fill ${item.fillClass}`} style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ 
              marginTop: '16px', 
              paddingTop: '16px', 
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)'
            }}>
              <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '6px' }}>Academic Summary & Insights</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Total Graded Students:</span>
                <strong style={{ color: 'var(--text-primary)' }}>{academicSummary.totalGraded || counts.students}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Institutional Average Score:</span>
                <strong style={{ color: 'var(--text-primary)' }}>{academicSummary.avgScore}</strong>
              </div>
              <div style={{ 
                background: 'var(--bg-base, #FFFDF0)', 
                padding: '8px 12px', 
                borderRadius: '6px', 
                border: '1px solid var(--border-subtle)',
                lineHeight: '1.4'
              }}>
                <strong>💡 Action:</strong> {academicSummary.atRiskCount} students require academic intervention. Schedule counseling reviews to mitigate risk.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="dash-right-column">
          {/* Quick Actions (Action Cards) */}
          <div className="quick-actions-card">
            <div className="dash-section-title">
              <h3>Institutional Control Panel</h3>
            </div>
            <div className="actions-card-grid">
              <Link to="/admin/classes" className="action-card-btn">
                <RiBookOpenLine className="action-card-icon" />
                <span>Manage Classes</span>
                <p>Overview of active classes & scheduling</p>
              </Link>
              <Link to="/admin/teachers" className="action-card-btn">
                <RiUserVoiceLine className="action-card-icon" />
                <span>Manage Teachers</span>
                <p>Update teacher assignments & profiles</p>
              </Link>
              <Link to="/admin/students" className="action-card-btn">
                <RiTeamLine className="action-card-icon" />
                <span>Manage Students</span>
                <p>Update database student rosters</p>
              </Link>
              <Link to="/admin/reports" className="action-card-btn">
                <RiBarChartBoxLine className="action-card-icon" />
                <span>Generate Report</span>
                <p>Export dropout risk indexes</p>
              </Link>
              <Link to="/admin/notifications" className="action-card-btn">
                <RiMailSendLine className="action-card-icon" />
                <span>Send Notice</span>
                <p>Send announcement alerts</p>
              </Link>
            </div>
          </div>

          {/* Recent Alerts (Notification Cards) */}
          <div className="dash-notif-card">
            <div className="dash-section-title">
              <h3>
                <RiNotification3Line /> System Notifications
              </h3>
            </div>
            <div className="alert-card-list">
              {ALERTS.map((alert) => (
                <div key={alert.id} className="alert-item">
                  <div className={`alert-icon-wrap ${alert.priority}`}>
                    {alert.icon}
                  </div>
                  <div className="alert-details">
                    <div className="alert-top">
                      <span className={`alert-category ${alert.priority}`}>
                        {alert.priority.toUpperCase()} PRIORITY
                      </span>
                      <span className="alert-time">
                        <RiTimeLine /> {alert.time}
                      </span>
                    </div>
                    <p className="alert-text">{alert.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── AI Academic Insight Section ─────────────────── */}
      <div className="dash-ai-insight-card" style={{ marginBottom: "24px" }}>
        <div className="dash-section-title">
          <h3>
            <RiLightbulbFlashLine className="ai-insight-icon" /> AI Institutional Academic Insight
          </h3>
          <span className={`badge ${insightData?.ollama_available ? 'badge-primary' : 'badge-warning'}`}>
            {insightLoading
              ? 'Generating institutional insights...'
              : insightData?.ollama_available
              ? 'Powered by Ollama llama3.2:3b'
              : 'Ollama Status'}
          </span>
        </div>

        {insightLoading ? (
          <div className="ai-insight-loading">
            <div className="ai-spinner" />
            <p>Generating institutional trend analysis & administrative policy recommendations...</p>
          </div>
        ) : insightError || (insightData && !insightData.ollama_available) ? (
          <div className="ai-insight-fallback">
            <p className="fallback-message">
              ⚠️ {insightError || 'AI explanation is temporarily unavailable.'}
            </p>
            <p className="fallback-sub">
              Institutional Random Forest risk evaluations remain active in the summary tables below.
            </p>
          </div>
        ) : insightData ? (
          <div className="ai-insight-body">
            {/* Explanation */}
            <div className="ai-insight-explanation">
              <h4>Institutional Risk Summary for Administrators</h4>
              <p>{insightData.explanation}</p>
            </div>

            <div className="ai-insight-grid">
              {/* Key Contributing Factors */}
              {insightData.key_factors && insightData.key_factors.length > 0 && (
                <div className="ai-insight-block">
                  <h4>Major Risk Factors Across Roster</h4>
                  <ul className="ai-factors-list">
                    {insightData.key_factors.map((factor, idx) => (
                      <li key={idx}>
                        <span className="factor-bullet">•</span> {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommended Actions for Admin */}
              {((insightData.recommendations?.admin && insightData.recommendations.admin.length > 0) ||
                (insightData.recommendations?.teacher && insightData.recommendations.teacher.length > 0)) && (
                <div className="ai-insight-block">
                  <h4>Recommended Administrative Actions</h4>
                  <ul className="ai-actions-list">
                    {(insightData.recommendations?.admin || insightData.recommendations?.teacher || []).map((action, idx) => (
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

      {/* ── 5. Student Lists: Performance vs At Risk ─────── */}
      <div className="lists-grid">
        <div className="list-card">
          <h3>Top Performing Students</h3>
          <div className="students-mini-list">
            {(topStudentsList.length > 0 ? topStudentsList : TOP_STUDENTS).map((student) => (
              <div key={student.id} className="student-mini-item">
                <div className="student-mini-info">
                  <h4>{student.name}</h4>
                  <p>{student.dept}</p>
                </div>
                <div className={`student-mini-metric high`}>
                  {student.metric}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="list-card">
          <h3>Students At Dropout Risk (Random Forest AI)</h3>
          {riskLoading ? (
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", padding: "12px" }}>Loading AI risk analysis...</p>
          ) : riskError ? (
            <p style={{ color: "var(--accent-danger)", fontSize: "0.9rem", padding: "12px" }}>⚠️ {riskError}</p>
          ) : (
            <div className="students-mini-list">
              {atRiskList.map((student, idx) => (
                <div key={student.id || idx} className="student-mini-item">
                  <div className="student-mini-info">
                    <h4>{student.name}</h4>
                    <p>{student.dept}</p>
                  </div>
                  <div className={`student-mini-metric ${student.status || 'risk'}`}>
                    {student.metric}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;