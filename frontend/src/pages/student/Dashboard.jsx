import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  RiCalendarCheckLine,
  RiBarChartBoxLine,
  RiAlertLine,
  RiLightbulbFlashLine,
  RiArrowRightLine,
  RiNotification3Line,
  RiCheckboxCircleLine,
  RiTimeLine,
  RiRocketLine,
} from 'react-icons/ri';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area,
} from 'recharts';
import Card from '../../components/common/Card';
import useAuth from '../hooks/useAuth';
import { edupathApi } from '../../services/edupathApi';
import './Dashboard.css';

// ── Dummy data ─────────────────────────────────────────────────────────────
const PERFORMANCE_TREND = [
  { month: 'Unit Test 1', marks: 74 },
  { month: 'Unit Test 2', marks: 78 },
  { month: 'Quarterly Exam', marks: 82 },
  { month: 'Half-Yearly Exam', marks: 79 },
  { month: 'Unit Test 3', marks: 85 },
  { month: 'Annual Exam', marks: 91 },
];

const NOTIFICATIONS = [
  { id: 1, type: 'info', icon: '📚', text: 'Mathematics homework due tomorrow.', time: '2h ago' },
  { id: 2, type: 'success', icon: '🏆', text: 'Career Assessment completed successfully.', time: '5h ago' },
  { id: 3, type: 'warning', icon: '⚠️', text: 'Attendance below 75% in English.', time: '1d ago' },
];

const TASKS = [
  { id: 1, label: 'Complete Career Assessment', done: false, due: 'Today', priority: 'high' },
  { id: 2, label: 'Complete Mathematics Homework', done: false, due: 'Tomorrow', priority: 'high' },
  { id: 3, label: 'Prepare for Science Unit Test', done: false, due: 'In 3 days', priority: 'medium' },
  { id: 4, label: 'Revise English Grammar', done: true, due: 'Done', priority: 'low' },
  { id: 5, label: 'Attend Parent-Teacher Meeting', done: false, due: 'Friday', priority: 'medium' },
  { id: 6, label: 'Practice for Annual Sports Day', done: false, due: 'Next week', priority: 'low' },
];
// ────────────────────────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="dash-tooltip">
        <p>{label}</p>
        <p><strong>{payload[0].value}%</strong> Marks</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState(TASKS);
  const [timeStr, setTimeStr] = useState('');
  
  // Dynamic Overall Percentage State
  const [overallPercentageData, setOverallPercentageData] = useState(null);
  const [pctLoading, setPctLoading] = useState(true);

  // Dynamic Class Rank State
  const [classRankData, setClassRankData] = useState(null);
  const [rankLoading, setRankLoading] = useState(true);

  // Dynamic Attendance Summary State
  const [attendanceData, setAttendanceData] = useState(null);
  const [attendanceLoading, setAttendanceLoading] = useState(true);

  // Random Forest Dropout Risk State
  const [dropoutRiskData, setDropoutRiskData] = useState(null);
  const [riskLoading, setRiskLoading] = useState(true);
  const [riskError, setRiskError] = useState(null);

  // Ollama AI Academic Insight State
  const [insightData, setInsightData] = useState(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const [insightError, setInsightError] = useState(null);

  useEffect(() => {
    const update = () => {
      const h = new Date().getHours();
      setTimeStr(h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening');
    };
    update();

    const fetchAiData = async () => {
      try {
        setRiskLoading(true);
        setRiskError(null);
        setPctLoading(true);
        setRankLoading(true);
        setAttendanceLoading(true);

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

        if (!student?.id) {
          setRiskError('Missing student profile');
          setRiskLoading(false);
          setPctLoading(false);
          setRankLoading(false);
          setAttendanceLoading(false);
          return;
        }

        console.log(`[Student Dashboard] Logged-in student ID: ${student.id} (${student.fullName || 'Student'})`);

        // Fetch Dynamic Overall Percentage from MySQL student_marks
        edupathApi.getStudentOverallPercentage(student.id)
          .then((res) => setOverallPercentageData(res))
          .catch((err) => console.error('[Student Dashboard] Percentage Fetch Error:', err))
          .finally(() => setPctLoading(false));

        // Fetch Dynamic Class Rank from MySQL student_marks
        edupathApi.getStudentClassRank(student.id)
          .then((res) => setClassRankData(res))
          .catch((err) => console.error('[Student Dashboard] Class Rank Fetch Error:', err))
          .finally(() => setRankLoading(false));

        // Fetch Dynamic Attendance Summary from MySQL attendance
        edupathApi.getStudentAttendanceSummary(student.id)
          .then((res) => setAttendanceData(res))
          .catch((err) => console.error('[Student Dashboard] Attendance Fetch Error:', err))
          .finally(() => setAttendanceLoading(false));

        // Step A: Fetch Random Forest Prediction from MySQL data
        const riskRes = await edupathApi.getStudentDropoutRisk(student.id);
        console.log('[Student Dashboard] Random Forest Prediction:', riskRes);
        setDropoutRiskData(riskRes);
        setRiskLoading(false);

        // Step B: Asynchronously fetch Ollama explanation without blocking UI
        if (riskRes) {
          fetchAiExplanation(riskRes);
        }
      } catch (err) {
        console.error('[Student Dashboard] Failed to fetch dropout risk:', err);
        setRiskError(err.message || 'AI risk prediction is temporarily unavailable.');
        setRiskLoading(false);
        setPctLoading(false);
      }
    };

    const fetchAiExplanation = async (riskRes) => {
      try {
        setInsightLoading(true);
        setInsightError(null);

        const dropoutRisk = riskRes.dropout_risk || riskRes.dropoutRisk || 'Medium';
        const confidence = riskRes.confidence != null ? riskRes.confidence : 0.0;
        const featureSummary = riskRes.feature_summary || riskRes.featureSummary || {};

        const explanationPayload = {
          dropout_risk: dropoutRisk,
          confidence: confidence,
          student: featureSummary,
        };

        console.log('[Student Dashboard] Requesting Ollama explanation:', explanationPayload);
        const res = await edupathApi.getDropoutExplanation(explanationPayload);
        console.log('[Student Dashboard] Ollama Response:', res);
        setInsightData(res);
      } catch (err) {
        console.error('[Student Dashboard] Failed to fetch Ollama explanation:', err);
        setInsightError('AI explanation is temporarily unavailable.');
      } finally {
        setInsightLoading(false);
      }
    };

    fetchAiData();
  }, [user]);

  const toggleTask = (id) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  return (
    <div className="dashboard">
      {/* ── Welcome Hero ─────────────────────────── */}
      <div className="dash-welcome">
        <div className="dash-welcome-text">
          <h1>{timeStr}, <span className="text-gradient">{user?.name?.split(' ')[0] || 'Scholar'}!</span> 👋</h1>
          <p>Here's your academic overview and AI-powered insights for today.</p>
        </div>
        <div className="dash-welcome-actions">
          <Link to="/student/career-assessment" className="dash-quick-action" id="dashboard-assessment-btn">
            <RiRocketLine /> Take Career Assessment
          </Link>
        </div>
      </div>

      {/* ── Stat Cards ───────────────────────────── */}
      <div className="dash-stats">
        <Card
          icon={<RiCalendarCheckLine />}
          title="Attendance"
          value={
            attendanceLoading
              ? 'Loading...'
              : attendanceData?.hasAttendanceData
              ? `${attendanceData.attendancePercentage}%`
              : 'N/A'
          }
          badge={
            attendanceData?.hasAttendanceData
              ? attendanceData.status
              : 'No Data'
          }
          badgeType={
            attendanceData?.hasAttendanceData
              ? attendanceData.attendancePercentage >= 75
                ? 'success'
                : 'warning'
              : 'info'
          }
          hoverable
        >
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{
                width: `${attendanceData?.hasAttendanceData ? attendanceData.attendancePercentage : 0}%`,
                background:
                  (attendanceData?.attendancePercentage || 0) < 75
                    ? 'var(--gradient-warning)'
                    : 'var(--gradient-success)',
              }}
            />
          </div>
          <p className="dash-stat-sub">
            {attendanceLoading
              ? 'Loading attendance...'
              : attendanceData?.hasAttendanceData
              ? `Present ${attendanceData.presentDays} / ${attendanceData.totalDays} Recorded Days`
              : 'No attendance records logged'}
          </p>
        </Card>

        <Card
          icon={<RiBarChartBoxLine />}
          title="Overall Percentage"
          value={
            pctLoading
              ? 'Loading...'
              : overallPercentageData?.hasMarksData
              ? `${overallPercentageData.overallPercentage}%`
              : 'N/A'
          }
          badge={
            overallPercentageData?.hasMarksData
              ? `Grade ${overallPercentageData.grade}`
              : 'No Data'
          }
          badgeType={overallPercentageData?.hasMarksData ? 'primary' : 'warning'}
          hoverable
        >
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{
                width: `${overallPercentageData?.hasMarksData ? overallPercentageData.overallPercentage : 0}%`,
                background: 'var(--gradient-primary)',
              }}
            />
          </div>
          <p className="dash-stat-sub">
            {rankLoading
              ? 'Loading rank...'
              : classRankData?.hasRankData
              ? `Class Rank ${classRankData.classRank}`
              : 'Class Rank N/A'}
          </p>
        </Card>

        <Card
          icon={<RiAlertLine />}
          title="Dropout Risk"
          value={
            riskLoading
              ? 'Loading AI risk...'
              : riskError
              ? 'AI risk prediction is temporarily unavailable.'
              : dropoutRiskData?.dropout_risk || 'Low'
          }
          badge={
            riskLoading
              ? 'Evaluating...'
              : riskError
              ? 'Data Issue'
              : `${dropoutRiskData?.confidence || 0}% Confidence`
          }
          badgeType={
            riskError
              ? 'warning'
              : dropoutRiskData?.dropout_risk === 'High'
              ? 'danger'
              : dropoutRiskData?.dropout_risk === 'Medium'
              ? 'warning'
              : 'success'
          }
          hoverable
        >
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{
                width: `${dropoutRiskData?.confidence || 12}%`,
                background:
                  dropoutRiskData?.dropout_risk === 'High'
                    ? 'var(--gradient-danger)'
                    : dropoutRiskData?.dropout_risk === 'Medium'
                    ? 'var(--gradient-warning)'
                    : 'var(--gradient-success)',
              }}
            />
          </div>
          <p className="dash-stat-sub">
            {riskLoading
              ? 'Connecting to Random Forest AI model...'
              : riskError
              ? 'AI risk prediction is temporarily unavailable.'
              : `Random Forest prediction with ${dropoutRiskData?.confidence}% confidence`}
          </p>
        </Card>

        <Card
          icon={<RiLightbulbFlashLine />}
          title="Career Match"
          value="91%"
          badge="Top Match"
          badgeType="primary"
          hoverable
        >
          <p className="dash-career-label">Doctor</p>
          <Link to="/student/career-recommendation" className="dash-see-more">
            View details <RiArrowRightLine />
          </Link>
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
              ? 'Generating AI insights...'
              : insightData?.ollama_available
              ? 'Powered by Ollama llama3.2:3b'
              : 'Ollama Status'}
          </span>
        </div>

        {insightLoading ? (
          <div className="ai-insight-loading">
            <div className="ai-spinner" />
            <p>Generating personalized AI insights from your academic profile...</p>
          </div>
        ) : insightError || (insightData && !insightData.ollama_available) ? (
          <div className="ai-insight-fallback">
            <p className="fallback-message">
              ⚠️ {insightError || 'AI explanation is temporarily unavailable.'}
            </p>
            <p className="fallback-sub">
              Your Random Forest risk prediction ({dropoutRiskData?.dropout_risk || 'Active'}) and confidence ({dropoutRiskData?.confidence || 0}%) remain active.
            </p>
          </div>
        ) : insightData ? (
          <div className="ai-insight-body">
            {/* Explanation */}
            <div className="ai-insight-explanation">
              <h4>Academic Risk Analysis</h4>
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

              {/* Recommended Student Actions */}
              {insightData.recommendations?.student && insightData.recommendations.student.length > 0 && (
                <div className="ai-insight-block">
                  <h4>Recommended Actions for You</h4>
                  <ul className="ai-actions-list">
                    {insightData.recommendations.student.map((action, idx) => (
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


      {/* ── Charts + Notifications Row ─────────────── */}
      <div className="dash-main-row">
        {/* Performance Chart */}
        <div className="dash-chart-card">
          <div className="dash-section-title">
            <h3>Academic Progress</h3>
            <Link to="/student/performance" className="dash-see-more">View All <RiArrowRightLine /></Link>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={PERFORMANCE_TREND} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="markGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(108,99,255,0.07)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#a0a0c0', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#6060a0', fontSize: 11 }} tickLine={false} axisLine={false} domain={[60, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="marks" stroke="#6c63ff" strokeWidth={2.5} fill="url(#markGrad)" dot={{ fill: '#6c63ff', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Notifications */}
        <div className="dash-notif-card">
          <div className="dash-section-title">
            <h3><RiNotification3Line /> Recent Alerts</h3>
            <Link to="/student/notifications" className="dash-see-more">View All <RiArrowRightLine /></Link>
          </div>
          <div className="dash-notif-list">
            {NOTIFICATIONS.map((n) => (
              <div key={n.id} className={`dash-notif-item dash-notif-${n.type}`}>
                <span className="dash-notif-icon">{n.icon}</span>
                <div className="dash-notif-content">
                  <p>{n.text}</p>
                  <span className="dash-notif-time"><RiTimeLine /> {n.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Upcoming Tasks ──────────────────────── */}
      <div className="dash-tasks-card">
        <div className="dash-section-title">
          <h3>Upcoming Tasks</h3>
          <span className="badge badge-primary">Homework Progress: {Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100)}%</span>
        </div>
        <div className="dash-tasks-list">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`dash-task-item ${task.done ? 'task-done' : ''}`}
              onClick={() => toggleTask(task.id)}
            >
              <div className={`task-check ${task.done ? 'task-check-done' : ''}`}>
                {task.done && <RiCheckboxCircleLine />}
              </div>
              <div className="task-body">
                <span className="task-label">{task.label}</span>
                <span className={`task-due task-priority-${task.priority}`}>
                  <RiTimeLine /> {task.due}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;