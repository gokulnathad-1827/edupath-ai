import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { RiCheckboxCircleLine, RiErrorWarningLine, RiMessage2Line } from "react-icons/ri";
import { edupathApi } from "../../services/edupathApi";
import ConfirmModal from "../../components/common/ConfirmModal";

const Sessions = () => {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith("/admin");
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewSession, setViewSession] = useState(null);
    const [editSession, setEditSession] = useState(null);
    const [deleteModalSession, setDeleteModalSession] = useState(null);
    const [alertMsg, setAlertMsg] = useState({ text: "", type: "" });
    const [newSession, setNewSession] = useState({
        student: "",
        classSection: "",
        date: "",
        time: "",
        issue: "",
        notes: ""
    });

    const getBadgeType = (status) => {
        if (status === "Completed") return "success";
        if (status === "In Progress") return "warning";
        return "primary";
    };

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const data = await edupathApi.getAllCounselingSessions();
            if (Array.isArray(data)) {
                setSessions(
                    data.map((s) => ({
                        id: s.id,
                        student: s.student || s.studentName,
                        classSection: s.classSection || "Class 10-A",
                        date: s.date || s.sessionDate,
                        time: s.time || s.sessionTime,
                        issue: s.issue,
                        status: s.status,
                        badgeType: s.badgeType || getBadgeType(s.status),
                        notes: s.notes,
                    }))
                );
            }
        } catch (err) {
            console.error("[Counseling Sessions Load Error]", err);
            triggerAlert(err?.response?.data?.message || err?.message || "Failed to fetch counseling sessions.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const triggerAlert = (text, type = "success") => {
        setAlertMsg({ text, type });
        setTimeout(() => setAlertMsg({ text: "", type: "" }), 4000);
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await edupathApi.updateCounselingSession(editSession.id, {
                student: editSession.student,
                date: editSession.date,
                time: editSession.time,
                issue: editSession.issue,
                status: editSession.status,
                notes: editSession.notes,
            });
            setEditSession(null);
            triggerAlert("Session updated successfully in database.", "success");
            await fetchSessions();
        } catch (err) {
            console.error("[Counseling Session Update Error]", err);
            triggerAlert(err?.response?.data?.message || err?.message || "Failed to update session in database.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!deleteModalSession) return;
        try {
            setLoading(true);
            await edupathApi.deleteCounselingSession(deleteModalSession.id);
            setDeleteModalSession(null);
            triggerAlert("Counseling session deleted successfully.", "success");
            await fetchSessions();
        } catch (err) {
            console.error("[Counseling Session Delete Error]", err);
            triggerAlert(err?.response?.data?.message || err?.message || "Failed to delete counseling session.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleAddSession = async (e) => {
        e.preventDefault();
        if (!newSession.student.trim()) {
            triggerAlert("Please enter student name.", "error");
            return;
        }

        try {
            setLoading(true);
            const created = await edupathApi.createCounselingSession({
                student: newSession.student.trim(),
                classSection: newSession.classSection.trim() || "Class 10-A",
                date: newSession.date.trim(),
                time: newSession.time.trim(),
                issue: newSession.issue.trim(),
                notes: newSession.notes.trim() || "Scheduled session.",
                status: "Scheduled",
            });

            triggerAlert(`Scheduled: ${created.student || newSession.student.trim()} - ${created.issue || newSession.issue.trim()}`, "success");
            setNewSession({
                student: "",
                classSection: "",
                date: "",
                time: "",
                issue: "",
                notes: ""
            });
            await fetchSessions();
        } catch (err) {
            console.error("[Counseling Session Schedule Error]", err);
            triggerAlert(err?.response?.data?.message || err?.message || "Failed to schedule session in database.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard animate-fade-in">
            <div className="dash-welcome">
                <div className="dash-welcome-text">
                    <h1>Counseling Sessions 🗓️</h1>
                    <p>Manage and monitor counseling appointments and student interactions.</p>
                </div>
            </div>

            <div className="dash-tasks-card">
                <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%" }}>
                    {alertMsg.text && (
                        <div className={`form-notification form-notification-${alertMsg.type}`}>
                            <span className="form-notification-icon">
                                {alertMsg.type === "error" ? <RiErrorWarningLine /> : <RiCheckboxCircleLine />}
                            </span>
                            <span className="form-notification-content">
                                {alertMsg.text}
                            </span>
                        </div>
                    )}
                    
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "30px", width: "100%" }}>
                        {/* Left: Schedule Form (Admin only) */}
                        {isAdmin && (
                            <form onSubmit={handleAddSession} style={{ display: "flex", flexDirection: "column", gap: "12px", width: "300px", flexShrink: 0 }}>
                                <h3 style={{ color: "var(--text-primary)", fontSize: "1.1rem", marginBottom: "4px" }}>Schedule Session</h3>
                                
                                <div className="form-group">
                                    <label className="form-label" style={{ marginBottom: "4px" }}>Student Name</label>
                                    <input 
                                        className="form-input" 
                                        placeholder="Enter student name"
                                        value={newSession.student} 
                                        onChange={(e) => setNewSession({ ...newSession, student: e.target.value })}
                                        required
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label className="form-label" style={{ marginBottom: "4px" }}>Class / Section</label>
                                    <input 
                                        className="form-input" 
                                        placeholder="e.g. Class 10-A"
                                        value={newSession.classSection} 
                                        onChange={(e) => setNewSession({ ...newSession, classSection: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label" style={{ marginBottom: "4px" }}>Date</label>
                                    <input 
                                        className="form-input" 
                                        placeholder="e.g. 15 Jul 2026"
                                        value={newSession.date} 
                                        onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label" style={{ marginBottom: "4px" }}>Time</label>
                                    <input 
                                        className="form-input" 
                                        placeholder="e.g. 10:30 AM"
                                        value={newSession.time} 
                                        onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label" style={{ marginBottom: "4px" }}>Issue / Category</label>
                                    <input 
                                        className="form-input" 
                                        placeholder="e.g. Academic Stress"
                                        value={newSession.issue} 
                                        onChange={(e) => setNewSession({ ...newSession, issue: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label" style={{ marginBottom: "4px" }}>Notes / Instructions</label>
                                    <textarea 
                                        className="form-input" 
                                        placeholder="Add initial notes or instructions..."
                                        rows="2" 
                                        value={newSession.notes} 
                                        onChange={(e) => setNewSession({ ...newSession, notes: e.target.value })}
                                        style={{ resize: 'vertical', fontFamily: 'inherit' }}
                                    />
                                </div>
                                
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    style={{ 
                                        padding: "10px 16px", 
                                        borderRadius: "8px", 
                                        border: "none", 
                                        background: "#75070C", 
                                        color: "#fff", 
                                        cursor: "pointer",
                                        fontWeight: "600",
                                        marginTop: "12px"
                                    }}
                                >
                                    {loading ? "Scheduling..." : "Schedule Session"}
                                </button>
                            </form>
                        )}

                        {/* Right: Table */}
                        <div style={{ flex: 1, minWidth: "300px" }}>
                            {isAdmin && <h3 style={{ color: "var(--text-primary)", fontSize: "1.1rem", marginBottom: "16px" }}>Session Roster</h3>}
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "40px", textAlign: "center" }}>ID</th>
                                            <th>Student</th>
                                            <th style={{ whiteSpace: "nowrap" }}>Class / Section</th>
                                            <th style={{ whiteSpace: "nowrap" }}>Date</th>
                                            <th style={{ whiteSpace: "nowrap" }}>Time</th>
                                            <th>Issue</th>
                                            <th style={{ whiteSpace: "nowrap" }}>Status</th>
                                            <th style={{ textAlign: "center" }}>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {sessions.map((session) => (
                                            <tr key={session.id}>
                                                <td style={{ textAlign: "center" }}>{session.id}</td>
                                                <td style={{ whiteSpace: "nowrap" }}><strong>{session.student}</strong></td>
                                                <td style={{ whiteSpace: "nowrap" }}>{session.classSection}</td>
                                                <td style={{ whiteSpace: "nowrap" }}>{session.date}</td>
                                                <td style={{ whiteSpace: "nowrap" }}>{session.time}</td>
                                                <td>{session.issue}</td>
                                                <td style={{ whiteSpace: "nowrap" }}>
                                                    <span className={`badge badge-${session.badgeType}`} style={{ whiteSpace: "nowrap", display: "inline-block" }}>
                                                        {session.status}
                                                    </span>
                                                </td>
                                                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                                                    <button 
                                                        className="btn-action-sm" 
                                                        onClick={() => setViewSession(session)}
                                                    >
                                                        View
                                                    </button>
                                                    <button 
                                                        className="btn-action-sm" 
                                                        style={{ marginLeft: "8px" }}
                                                        onClick={() => setEditSession({ ...session })}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        className="btn-action-sm" 
                                                        style={{ marginLeft: "8px", background: "rgba(220, 38, 38, 0.1)", color: "#dc2626", border: "1px solid rgba(220, 38, 38, 0.2)" }}
                                                        onClick={() => setDeleteModalSession(session)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* View Session Modal */}
            {viewSession && (
                <div style={modalOverlayStyle}>
                    <div style={modalContainerStyle}>
                        <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
                            Session Details
                        </h3>
                        <div style={detailGridStyle}>
                            <div><strong>Student:</strong> {viewSession.student} ({viewSession.classSection})</div>
                            <div><strong>Date & Time:</strong> {viewSession.date} at {viewSession.time}</div>
                            <div><strong>Category/Issue:</strong> {viewSession.issue}</div>
                            <div>
                                <strong>Status:</strong>{" "}
                                <span className={`badge badge-${viewSession.badgeType}`} style={{ display: "inline-block" }}>
                                    {viewSession.status}
                                </span>
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                <strong>Counselor Notes:</strong>
                                <p style={{ marginTop: '6px', background: 'var(--bg-base, #FFFDF0)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                                    {viewSession.notes}
                                </p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                            <button 
                                onClick={() => setViewSession(null)}
                                style={primaryButtonStyle}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Session Modal */}
            {editSession && (
                <div style={modalOverlayStyle}>
                    <div style={modalContainerStyle}>
                        <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
                            Edit Session
                        </h3>
                        <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="form-group">
                                <label className="form-label">Student</label>
                                <input 
                                    className="form-input" 
                                    value={editSession.student} 
                                    disabled 
                                    style={{ background: 'var(--border-subtle)', cursor: 'not-allowed' }}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label className="form-label">Date</label>
                                    <input 
                                        className="form-input" 
                                        value={editSession.date} 
                                        onChange={(e) => setEditSession({ ...editSession, date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Time</label>
                                    <input 
                                        className="form-input" 
                                        value={editSession.time} 
                                        onChange={(e) => setEditSession({ ...editSession, time: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Issue</label>
                                <input 
                                    className="form-input" 
                                    value={editSession.issue} 
                                    onChange={(e) => setEditSession({ ...editSession, issue: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select 
                                    className="form-input form-select"
                                    value={editSession.status}
                                    onChange={(e) => setEditSession({ ...editSession, status: e.target.value })}
                                >
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Counselor Notes</label>
                                <textarea 
                                    className="form-input" 
                                    rows="3" 
                                    value={editSession.notes} 
                                    onChange={(e) => setEditSession({ ...editSession, notes: e.target.value })}
                                    style={{ resize: 'vertical', fontFamily: 'inherit' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                                <button type="submit" style={primaryButtonStyle} disabled={loading}>
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                                <button 
                                    type="button" 
                                    style={ghostButtonStyle} 
                                    onClick={() => setEditSession(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirm Delete Modal */}
            <ConfirmModal 
                isOpen={!!deleteModalSession}
                title="Delete Counseling Session"
                message={`Are you sure you want to delete the counseling session for ${deleteModalSession?.student}? This action cannot be undone.`}
                confirmText="Delete Session"
                cancelText="Cancel"
                isDanger={true}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteModalSession(null)}
            />
        </div>
    );
};

// Styling structures matching design theme
const modalOverlayStyle = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.15)',
    display: 'grid',
    placeItems: 'center',
    zIndex: 2000,
    overflowY: 'auto',
    padding: '40px 16px',
};

const modalContainerStyle = {
    width: '100%',
    maxWidth: '500px',
    background: 'var(--bg-card, #fff)',
    border: '1.5px solid var(--border-card, #e5e5e5)',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: 'var(--shadow-lg)',
    margin: 'auto',
};

const detailGridStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
};

const primaryButtonStyle = {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    background: '#75070C',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: '600',
};

const ghostButtonStyle = {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid var(--border-subtle)',
    background: 'transparent',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontWeight: '600',
};

export default Sessions;