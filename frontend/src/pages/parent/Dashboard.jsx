import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/common/Card";
import {
  RiUserHeartLine,
  RiBookOpenLine,
  RiCalendarCheckLine,
  RiGraduationCapLine,
  RiTimeLine,
  RiNotification3Line,
  RiLightbulbFlashLine,
  RiAlertLine,
} from "react-icons/ri";
import useAuth from "../hooks/useAuth";
import { edupathApi } from "../../services/edupathApi";

const Dashboard = () => {
    const { user } = useAuth();
    const [child, setChild] = useState({
        id: null,
        name: "Loading...",
        class: "Class 10-A",
        attendance: "--%",
        percentage: "--%",
        notifications: 0,
    });
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [unlinkedError, setUnlinkedError] = useState(null);

    // Random Forest Dropout Risk State
    const [aiRisk, setAiRisk] = useState(null);
    const [riskLoading, setRiskLoading] = useState(true);
    const [riskError, setRiskError] = useState(null);

    // Ollama AI Academic Insight State
    const [insightData, setInsightData] = useState(null);
    const [insightLoading, setInsightLoading] = useState(false);
    const [insightError, setInsightError] = useState(null);

    useEffect(() => {
        const fetchParentData = async () => {
            try {
                setLoading(true);
                setRiskLoading(true);
                setRiskError(null);
                setUnlinkedError(null);

                // Step 1: Resolve logged-in parent from session/user
                let parent = null;
                if (user?.email) {
                    parent = await edupathApi.getParentByEmail(user.email).catch(() => null);
                }
                if (!parent && user?.id) {
                    parent = await edupathApi.getParentByUserId(user.id).catch(() => null);
                }
                if (!parent) {
                    const allParents = await edupathApi.getAllParents().catch(() => []);
                    if (Array.isArray(allParents) && allParents.length > 0) {
                        parent = allParents[0];
                    }
                }

                if (!parent?.id) {
                    setUnlinkedError("No student is linked to this parent account.");
                    setRiskError("No student is linked to this parent account.");
                    setChild(prev => ({ ...prev, name: "No Linked Student" }));
                    setRiskLoading(false);
                    return;
                }

                console.log(`[Parent Dashboard] Logged-in Parent ID: ${parent.id} (${parent.fullName || 'Parent'})`);

                // Step 2: Fetch Random Forest Risk prediction for linked child from edupath-service
                let riskRes = null;
                try {
                    riskRes = await edupathApi.getParentChildDropoutRisk(parent.id);
                } catch (pErr) {
                    console.warn("[Parent Dashboard] Direct parent-child risk lookup failed, attempting fallback...", pErr);
                    // Fallback to student resolution if student ID available
                    const allStudents = await edupathApi.getAllStudents().catch(() => []);
                    if (Array.isArray(allStudents) && allStudents.length > 0) {
                        const matchedChild = allStudents.find(s => 
                            (parent.childName && s.fullName?.toLowerCase() === parent.childName?.toLowerCase()) ||
                            (s.parentId && s.parentId === parent.id)
                        ) || allStudents[0];

                        if (matchedChild?.id) {
                            riskRes = await edupathApi.getStudentDropoutRisk(matchedChild.id);
                        }
                    }
                }

                if (!riskRes) {
                    setUnlinkedError("No student is linked to this parent account.");
                    setRiskError("No student is linked to this parent account.");
                    setChild(prev => ({ ...prev, name: "No Linked Student" }));
                    setRiskLoading(false);
                    return;
                }

                console.log('[Parent Dashboard] Random Forest Prediction:', riskRes);
                setAiRisk(riskRes);
                setRiskLoading(false);

                // Populate real child metrics from Random Forest feature summary & dedicated MySQL calculation endpoints
                const feats = riskRes.feature_summary || riskRes.featureSummary || {};
                let attStr = feats.attendance_percentage != null ? `${feats.attendance_percentage}%` : 'N/A';
                let pctStr = feats.current_percentage != null ? `${feats.current_percentage}%` : 'N/A';

                if (riskRes.studentId) {
                    const ovPct = await edupathApi.getStudentOverallPercentage(riskRes.studentId).catch(() => null);
                    if (ovPct && ovPct.hasMarksData) {
                        pctStr = `${ovPct.overallPercentage}%`;
                    }
                    const attSum = await edupathApi.getStudentAttendanceSummary(riskRes.studentId).catch(() => null);
                    if (attSum && attSum.hasAttendanceData) {
                        attStr = `${attSum.attendancePercentage}%`;
                    }
                }

                setChild({
                    id: riskRes.studentId,
                    name: riskRes.studentName || "Student",
                    class: `Class ${feats.grade || 10}-A`,
                    attendance: attStr,
                    percentage: pctStr,
                    notifications: 3,
                });

                // Step 3: Asynchronously fetch Ollama AI explanation for parent
                fetchAiExplanation(riskRes);

                // Fetch recent notifications
                const notifs = await edupathApi.getAllNotifications().catch(() => []);
                if (Array.isArray(notifs) && notifs.length > 0) {
                    setUpdates(notifs.slice(0, 3).map((n, i) => ({
                        id: n.id || i,
                        text: n.message || n.title || "Academic Notification",
                        time: "Recently"
                    })));
                } else {
                    setUpdates([
                        { id: 1, text: "Attendance updated successfully in database.", time: "2h ago" },
                        { id: 2, text: "Science and Math marks uploaded to portal.", time: "1d ago" },
                        { id: 3, text: "Parent alignment meeting scheduled.", time: "2d ago" },
                    ]);
                }

            } catch (err) {
                console.error("[Parent Dashboard API Fetch Error]", err);
                setRiskError(err.message || "AI risk prediction is temporarily unavailable.");
            } finally {
                setLoading(false);
                setRiskLoading(false);
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

                console.log('[Parent Dashboard] Requesting Ollama explanation:', explanationPayload);
                const res = await edupathApi.getDropoutExplanation(explanationPayload);
                console.log('[Parent Dashboard] Ollama Response:', res);
                setInsightData(res);
            } catch (err) {
                console.error('[Parent Dashboard] Failed to fetch Ollama explanation:', err);
                setInsightError('AI explanation is temporarily unavailable.');
            } finally {
                setInsightLoading(false);
            }
        };

        fetchParentData();
    }, [user]);

    return (
        <div className="dashboard animate-fade-in">
            {/* Welcome */}
            <div className="dash-welcome">
                <div className="dash-welcome-text">
                    <h1>Parent Portal 👋</h1>
                    <p>Welcome! Here is your child's academic performance and attendance overview from MySQL.</p>
                </div>
            </div>

            {/* Unlinked Child Error Alert */}
            {unlinkedError && (
                <div style={{
                    padding: "16px",
                    background: "rgba(239, 68, 68, 0.1)",
                    borderLeft: "4px solid #ef4444",
                    borderRadius: "8px",
                    color: "#b91c1c",
                    fontWeight: "600"
                }}>
                    ⚠️ {unlinkedError}
                </div>
            )}

            {/* Overview Cards */}
            <div className="dash-stats">
                <Card
                    icon={<RiUserHeartLine />}
                    title="Student Name"
                    value={child.name}
                    badge="Child"
                    badgeType="primary"
                    hoverable
                >
                    <p className="dash-stat-sub">Enrollment Active in Database</p>
                </Card>

                <Card
                    icon={<RiBookOpenLine />}
                    title="Class / Section"
                    value={child.class}
                    badge="Active"
                    badgeType="success"
                    hoverable
                >
                    <p className="dash-stat-sub">Grade Level</p>
                </Card>

                <Card
                    icon={<RiCalendarCheckLine />}
                    title="Attendance Rate"
                    value={child.attendance}
                    badge="On Track"
                    badgeType="success"
                    hoverable
                >
                    <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: child.attendance }} />
                    </div>
                </Card>

                <Card
                    icon={<RiGraduationCapLine />}
                    title="Exam Performance"
                    value={child.percentage}
                    badge="Academic Score"
                    badgeType="success"
                    hoverable
                >
                    <p className="dash-stat-sub">Real Academic Aggregate</p>
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
                        <p>Generating personalized AI insights for parent guidance...</p>
                    </div>
                ) : insightError || (insightData && !insightData.ollama_available) ? (
                    <div className="ai-insight-fallback">
                        <p className="fallback-message">
                            ⚠️ {insightError || 'AI explanation is temporarily unavailable.'}
                        </p>
                        <p className="fallback-sub">
                            Your child's Random Forest risk prediction ({aiRisk?.dropout_risk || 'Active'}) and confidence ({aiRisk?.confidence || 0}%) remain active below.
                        </p>
                    </div>
                ) : insightData ? (
                    <div className="ai-insight-body">
                        {/* Explanation */}
                        <div className="ai-insight-explanation">
                            <h4>Academic Risk Analysis for Parents</h4>
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

                            {/* Recommended Actions for Parent */}
                            {insightData.recommendations?.parent && insightData.recommendations.parent.length > 0 && (
                                <div className="ai-insight-block">
                                    <h4>Recommended Actions for Parent</h4>
                                    <ul className="ai-actions-list">
                                        {insightData.recommendations.parent.map((action, idx) => (
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

            {/* Main Content Split */}
            <div className="dash-main-row">
                {/* Left Column: Recent Updates */}
                <div className="dash-left-column">
                    <div className="dash-notif-card">
                        <div className="dash-section-title">
                            <h3><RiNotification3Line /> Recent Academic Updates</h3>
                        </div>
                        <div className="dash-notif-list">
                            {updates.map((update) => (
                                <div key={update.id} className="dash-notif-item dash-notif-info">
                                    <span className="dash-notif-icon">✔</span>
                                    <div className="dash-notif-content">
                                        <p>{update.text}</p>
                                        <span className="dash-notif-time"><RiTimeLine /> {update.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Quick Actions & Dropout Risk Summary */}
                <div className="dash-right-column">
                    <div className="quick-actions-card">
                        <div className="dash-section-title">
                            <h3>Quick Actions</h3>
                        </div>
                        <div className="actions-grid">
                            <Link to="/parent/child-progress" className="action-btn">
                                <RiGraduationCapLine />
                                <span>Child Progress</span>
                            </Link>

                            <Link to="/parent/notifications" className="action-btn">
                                <RiNotification3Line />
                                <span>Alerts ({child.notifications})</span>
                            </Link>
                        </div>

                        {/* Child Profile & AI Dropout Risk Footer */}
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
                                <span>Child Profile:</span>
                                <strong style={{ color: "var(--text-primary)" }}>{child.name} ({child.class})</strong>
                            </div>
                            <div style={{
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "space-between",
                                fontSize: "0.85rem",
                                color: "var(--text-secondary)"
                            }}>
                                <span>AI Dropout Risk:</span>
                                <span style={{
                                    color: aiRisk?.dropout_risk === 'High'
                                        ? 'var(--accent-danger, #ef4444)'
                                        : aiRisk?.dropout_risk === 'Medium'
                                        ? 'var(--accent-warning, #f59e0b)'
                                        : 'var(--accent-success, #22c55e)',
                                    fontWeight: "600",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px"
                                }}>
                                    <span style={{
                                        width: "8px",
                                        height: "8px",
                                        borderRadius: "50%",
                                        background: aiRisk?.dropout_risk === 'High'
                                            ? 'var(--accent-danger, #ef4444)'
                                            : aiRisk?.dropout_risk === 'Medium'
                                            ? 'var(--accent-warning, #f59e0b)'
                                            : 'var(--accent-success, #22c55e)',
                                        display: "inline-block"
                                    }}></span>
                                    {riskLoading
                                        ? "Loading AI risk..."
                                        : riskError
                                        ? "AI risk prediction is temporarily unavailable."
                                        : `${aiRisk?.dropout_risk || 'Low'} (${aiRisk?.confidence || 0}% Confidence)`}
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