import React, { useState, useEffect } from "react";
import RiskChart from "../../components/charts/RiskChart";
import Card from "../../components/common/Card";
import {
  RiUserHeartLine,
  RiAlertLine,
  RiCalendarEventLine,
  RiCheckboxCircleLine,
  RiFileTextLine,
  RiLightbulbFlashLine,
  RiTeamLine,
} from "react-icons/ri";
import useAuth from "../hooks/useAuth";
import { edupathApi } from "../../services/edupathApi";

const Dashboard = () => {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState({
        totalStudents: 0,
        atRiskStudents: 0,
        sessionsToday: 0,
        completedSessions: 0,
    });
    const [recentSessions, setRecentSessions] = useState([]);
    const [loading, setLoading] = useState(false);

    // Supervised Student Risk & Ollama Insight State
    const [counselorStudentsRisk, setCounselorStudentsRisk] = useState([]);
    const [riskLoading, setRiskLoading] = useState(true);
    const [riskError, setRiskError] = useState(null);

    const [aiSummary, setAiSummary] = useState(null);
    const [insightData, setInsightData] = useState(null);
    const [insightLoading, setInsightLoading] = useState(false);
    const [insightError, setInsightError] = useState(null);

    useEffect(() => {
        const fetchCounselorData = async () => {
            try {
                setLoading(true);
                setRiskLoading(true);
                setRiskError(null);

                // Step 1: Resolve logged-in counselor from session/user
                let counselor = null;
                if (user?.email) {
                    counselor = await edupathApi.getCounselorByEmail(user.email).catch(() => null);
                }
                if (!counselor && user?.id) {
                    counselor = await edupathApi.getCounselorByUserId(user.id).catch(() => null);
                }
                if (!counselor) {
                    const allCounselors = await edupathApi.getAllCounselors().catch(() => []);
                    if (Array.isArray(allCounselors) && allCounselors.length > 0) {
                        counselor = allCounselors[0];
                    }
                }

                if (!counselor?.id) {
                    setRiskError("No counselor record found.");
                    setRiskLoading(false);
                    return;
                }

                console.log(`[Counselor Dashboard] Logged-in Counselor ID: ${counselor.id} (${counselor.fullName || 'Counselor'})`);

                // Step 2: Fetch Random Forest Risk predictions for counselor's supervised students
                let supervisedRisks = [];
                try {
                    supervisedRisks = await edupathApi.getCounselorStudentsDropoutRisk(counselor.id);
                } catch (cErr) {
                    console.warn("[Counselor Dashboard] Batch student risk lookup error:", cErr);
                    setRiskError("AI risk prediction is temporarily unavailable.");
                }

                if (!Array.isArray(supervisedRisks)) {
                    supervisedRisks = [];
                }

                console.log('[Counselor Dashboard] Supervised Students Risk Predictions:', supervisedRisks);
                setCounselorStudentsRisk(supervisedRisks);
                setRiskLoading(false);

                // Calculate dynamic risk counts
                const totalStuds = supervisedRisks.length;
                const highRiskCount = supervisedRisks.filter(r => (r.dropoutRisk || r.dropout_risk) === 'High').length;
                const mediumRiskCount = supervisedRisks.filter(r => (r.dropoutRisk || r.dropout_risk) === 'Medium').length;
                const lowRiskCount = supervisedRisks.filter(r => (r.dropoutRisk || r.dropout_risk) === 'Low').length;
                const atRiskCount = highRiskCount + mediumRiskCount;

                const summaryObj = {
                    low_risk: lowRiskCount,
                    medium_risk: mediumRiskCount,
                    high_risk: highRiskCount,
                    total_students: totalStuds,
                };
                setAiSummary(summaryObj);

                // Fetch real counseling session records from MySQL
                const sessions = await edupathApi.getAllCounselingSessions().catch(() => []);
                const totalSess = Array.isArray(sessions) ? sessions.length : 0;
                const completedSess = Array.isArray(sessions)
                    ? sessions.filter(s => s.status?.toLowerCase() === "completed").length
                    : 0;

                setDashboardData({
                    totalStudents: totalStuds,
                    atRiskStudents: atRiskCount,
                    sessionsToday: totalSess,
                    completedSessions: completedSess,
                });

                if (Array.isArray(sessions) && sessions.length > 0) {
                    setRecentSessions(sessions.slice(0, 4).map((s) => ({
                        student: s.student || s.studentName,
                        issue: s.issue || "General Consultation",
                        status: s.status || "Scheduled",
                        badgeType: s.status?.toLowerCase() === "completed" ? "success" : (s.status?.toLowerCase() === "in progress" ? "warning" : "primary")
                    })));
                } else {
                    setRecentSessions([]);
                }

                // Step 3: Asynchronously fetch Ollama AI explanation for counselor guidance
                if (supervisedRisks.length > 0) {
                    const targetStudentRisk = supervisedRisks.find(r => (r.dropoutRisk || r.dropout_risk) === 'High') ||
                                              supervisedRisks.find(r => (r.dropoutRisk || r.dropout_risk) === 'Medium') ||
                                              supervisedRisks[0];
                    fetchAiExplanation(targetStudentRisk);
                }

            } catch (err) {
                console.error("[Counselor Dashboard API Fetch Error]", err);
                setRiskError("AI risk prediction is temporarily unavailable.");
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

                console.log('[Counselor Dashboard] Requesting Ollama explanation for target student:', targetRisk.studentName, explanationPayload);
                const res = await edupathApi.getDropoutExplanation(explanationPayload);
                console.log('[Counselor Dashboard] Ollama Response:', res);
                setInsightData(res);
            } catch (err) {
                console.error('[Counselor Dashboard] Failed to fetch Ollama explanation:', err);
                setInsightError('AI explanation is temporarily unavailable.');
            } finally {
                setInsightLoading(false);
            }
        };

        fetchCounselorData();
    }, [user]);

    return (
        <div className="dashboard animate-fade-in">
            {/* Welcome Hero */}
            <div className="dash-welcome">
                <div className="dash-welcome-text">
                    <h1>Counselor Dashboard 🧠</h1>
                    <p>Monitor students and manage counseling activities from MySQL database.</p>
                </div>
            </div>

            {/* Dashboard Cards */}
            <div className="dash-stats">
                <Card
                    icon={<RiUserHeartLine />}
                    title="Total Students"
                    value={dashboardData.totalStudents}
                    badge="Supervised"
                    badgeType="success"
                    hoverable
                >
                  <p className="dash-stat-sub">Under supervision in DB</p>
                </Card>

                <Card
                  icon={<RiAlertLine />}
                  title="At-Risk Students"
                  value={dashboardData.atRiskStudents}
                  badge="Immediate Action"
                  badgeType="danger"
                  hoverable
                >
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ 
                        width: `${dashboardData.totalStudents ? Math.round((dashboardData.atRiskStudents / dashboardData.totalStudents) * 100) : 0}%`, 
                        background: 'var(--gradient-danger)' 
                    }} />
                  </div>
                  <p className="dash-stat-sub">Based on AI analytics</p>
                </Card>

                <Card
                  icon={<RiCalendarEventLine />}
                  title="Total Sessions"
                  value={dashboardData.sessionsToday}
                  badge="Active"
                  badgeType="primary"
                  hoverable
                >
                  <p className="dash-stat-sub">Registered sessions</p>
                </Card>

                <Card
                  icon={<RiCheckboxCircleLine />}
                  title="Completed Sessions"
                  value={dashboardData.completedSessions}
                  badge="Done"
                  badgeType="success"
                  hoverable
                >
                  <p className="dash-stat-sub">Finished discussions</p>
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
                            ? 'Generating counselor insights...'
                            : insightData?.ollama_available
                            ? 'Powered by Ollama llama3.2:3b'
                            : 'Ollama Status'}
                    </span>
                </div>

                {insightLoading ? (
                    <div className="ai-insight-loading">
                        <div className="ai-spinner" />
                        <p>Generating personalized counselor guidance & intervention strategies...</p>
                    </div>
                ) : insightError || (insightData && !insightData.ollama_available) ? (
                    <div className="ai-insight-fallback">
                        <p className="fallback-message">
                            ⚠️ {insightError || 'AI explanation is temporarily unavailable.'}
                        </p>
                        <p className="fallback-sub">
                            Supervised student risk predictions and counseling session records remain active below.
                        </p>
                    </div>
                ) : insightData ? (
                    <div className="ai-insight-body">
                        {/* Explanation */}
                        <div className="ai-insight-explanation">
                            <h4>Academic Risk Analysis for Counselors</h4>
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

                            {/* Recommended Actions for Counselor */}
                            {insightData.recommendations?.counselor && insightData.recommendations.counselor.length > 0 && (
                                <div className="ai-insight-block">
                                    <h4>Recommended Actions for Counselor</h4>
                                    <ul className="ai-actions-list">
                                        {insightData.recommendations.counselor.map((action, idx) => (
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

            {/* ── Supervised Students AI Risk Overview Table ── */}
            <div className="perf-overview-card animate-fade-in" style={{ padding: "20px" }}>
                <div className="dash-section-title" style={{ marginBottom: "16px" }}>
                    <h3>
                        <RiTeamLine /> Supervised Students AI Risk Overview
                    </h3>
                    <span className="badge badge-primary">
                        {riskLoading ? "Loading AI risk analysis..." : `${counselorStudentsRisk.length} Students Evaluated`}
                    </span>
                </div>

                {riskLoading ? (
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Loading student risk analysis...</p>
                ) : riskError ? (
                    <p style={{ color: "var(--accent-danger)", fontSize: "0.9rem" }}>⚠️ {riskError}</p>
                ) : counselorStudentsRisk.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No students currently supervised under this counselor account.</p>
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
                                {counselorStudentsRisk.map((s, idx) => {
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

            {/* Risk Analysis + Recent Sessions Row */}
            <div className="dash-main-row">
                {/* Risk Chart */}
                <div className="dash-chart-card">
                    <div className="dash-section-title">
                        <h3><RiFileTextLine /> Student Risk Analysis</h3>
                    </div>
                    <RiskChart summaryData={aiSummary} />
                </div>

                {/* Recent Sessions */}
                <div className="dash-notif-card">
                    <div className="dash-section-title">
                        <h3><RiCalendarEventLine /> Recent Sessions</h3>
                    </div>
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th style={{ whiteSpace: "nowrap" }}>Student</th>
                                    <th style={{ whiteSpace: "nowrap" }}>Issue</th>
                                    <th style={{ whiteSpace: "nowrap" }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentSessions.map((session, index) => (
                                    <tr key={index}>
                                        <td style={{ whiteSpace: "nowrap" }}><strong>{session.student}</strong></td>
                                        <td style={{ whiteSpace: "nowrap" }}>{session.issue}</td>
                                        <td style={{ whiteSpace: "nowrap" }}>
                                            <span className={`badge badge-${session.badgeType}`} style={{ whiteSpace: "nowrap", display: "inline-block" }}>
                                                {session.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div className="dash-tasks-card">
                <div className="dash-section-title">
                    <h3>AI Counseling Summary</h3>
                </div>
                <div className="dash-tasks-list">
                    <div className="dash-task-item">
                        <span className="task-label">✔ {dashboardData.totalStudents} total supervised students evaluated ({aiSummary?.high_risk || 0} High, {aiSummary?.medium_risk || 0} Medium, {aiSummary?.low_risk || 0} Low Risk).</span>
                    </div>
                    <div className="dash-task-item">
                        <span className="task-label">✔ {dashboardData.sessionsToday} counseling sessions registered ({dashboardData.completedSessions} completed) in MySQL database.</span>
                    </div>
                    <div className="dash-task-item">
                        <span className="task-label">✔ AI Risk Analysis and counseling database records updated successfully.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;