import React, { useState, useEffect } from "react";
import { markAttendance, getAttendance, updateAttendance, deleteAttendance } from "../../pages/services/attendanceService";
import ConfirmModal from "../common/ConfirmModal";
import { RiCheckboxCircleLine, RiErrorWarningLine, RiEditLine, RiDeleteBinLine, RiCloseLine } from "react-icons/ri";

const AttendanceForm = () => {
    const [name, setName] = useState("");
    const [status, setStatus] = useState("Present");
    const [attendanceList, setAttendanceList] = useState([]);
    const [alertMsg, setAlertMsg] = useState({ text: "", type: "" });
    const [loading, setLoading] = useState(false);

    // Edit Modal State
    const [editingRecord, setEditingRecord] = useState(null);
    const [editName, setEditName] = useState("");
    const [editStatus, setEditStatus] = useState("Present");
    const [editDate, setEditDate] = useState("");
    const [editLoading, setEditLoading] = useState(false);

    // Delete Modal State
    const [deletingRecord, setDeletingRecord] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        loadAttendance();
    }, []);

    const loadAttendance = async () => {
        try {
            const list = await getAttendance();
            if (Array.isArray(list)) {
                setAttendanceList([...list]);
            }
        } catch (err) {
            console.error("[Attendance Load Error]", err);
            triggerAlert("Failed to load attendance logs from server.", "error");
        }
    };

    const triggerAlert = (text, type = "success") => {
        setAlertMsg({ text, type });
        setTimeout(() => setAlertMsg({ text: "", type: "" }), 4000);
    };

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

        if (!name.trim()) {
            triggerAlert("Please enter a student name.", "error");
            return;
        }

        try {
            setLoading(true);
            await markAttendance({ name: name.trim(), status });
            triggerAlert(`✓ Saved attendance: ${name.trim()} - ${status}`, "success");
            setName("");
            await loadAttendance();
        } catch (err) {
            console.error("[Attendance Save Error]", err);
            const errMsg = err?.response?.data?.message || err?.message || "Failed to save attendance to backend database.";
            triggerAlert(`✕ ${errMsg}`, "error");
        } finally {
            setLoading(false);
        }
    };

    // Open Edit Modal
    const handleOpenEdit = (log) => {
        setEditingRecord(log);
        setEditName(log.name || log.studentName || "");
        setEditStatus(log.status || "Present");
        setEditDate(log.date || new Date().toISOString().split("T")[0]);
    };

    // Submit Edit Form
    const handleSaveEdit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!editingRecord) return;

        if (!editName.trim()) {
            triggerAlert("Please enter a student name.", "error");
            return;
        }

        try {
            setEditLoading(true);
            await updateAttendance(editingRecord.id, {
                name: editName.trim(),
                studentName: editName.trim(),
                status: editStatus,
                date: editDate
            });
            triggerAlert(`✓ Updated attendance for ${editName.trim()}`, "success");
            setEditingRecord(null);
            await loadAttendance();
        } catch (err) {
            console.error("[Attendance Update Error]", err);
            const errMsg = err?.response?.data?.message || err?.message || "Failed to update attendance.";
            triggerAlert(`✕ ${errMsg}`, "error");
        } finally {
            setEditLoading(false);
        }
    };

    // Confirm Delete Action
    const handleConfirmDelete = async () => {
        if (!deletingRecord) return;
        try {
            setDeleteLoading(true);
            await deleteAttendance(deletingRecord.id);
            triggerAlert(`✓ Deleted attendance record for ${deletingRecord.name || deletingRecord.studentName}`, "success");
            setDeletingRecord(null);
            await loadAttendance();
        } catch (err) {
            console.error("[Attendance Delete Error]", err);
            const errMsg = err?.response?.data?.message || err?.message || "Failed to delete attendance record.";
            triggerAlert(`✕ ${errMsg}`, "error");
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
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
                {/* Left: Form */}
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", width: "300px", flexShrink: 0 }}>
                    <div className="form-group">
                        <label className="form-label" style={{ marginBottom: '6px' }}>Student Name</label>
                        <input
                            placeholder="Student Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={loading}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" style={{ marginBottom: '6px' }}>Status</label>
                        <select 
                            value={status} 
                            onChange={(e) => setStatus(e.target.value)}
                            disabled={loading}
                            className="form-input form-select"
                        >
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                        </select>
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
                            cursor: loading ? "not-allowed" : "pointer",
                            fontWeight: "600",
                            marginTop: "8px",
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? "Saving..." : "Save Attendance"}
                    </button>
                </form>

                {/* Right: Table */}
                <div style={{ flex: 1, minWidth: "300px" }}>
                    <h3 style={{ marginBottom: "16px", color: "var(--text-primary)", fontSize: "1.1rem" }}>Daily Attendance Roster</h3>
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th style={{ textAlign: "center", width: "130px" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceList.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: "center" }}>No logs recorded yet.</td>
                                    </tr>
                                ) : (
                                    attendanceList.map((log, index) => (
                                        <tr key={log.id || index}>
                                            <td><strong>{log.name || log.studentName}</strong></td>
                                            <td>
                                                <span style={{ 
                                                    color: log.status === 'Present' ? '#10B981' : '#EF4444',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {log.status}
                                                </span>
                                            </td>
                                            <td>{log.date}</td>
                                            <td style={{ textAlign: "center" }}>
                                                <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenEdit(log)}
                                                        title="Edit Attendance"
                                                        style={{
                                                            padding: "6px 10px",
                                                            borderRadius: "6px",
                                                            border: "1px solid #3b82f6",
                                                            background: "rgba(59, 130, 246, 0.1)",
                                                            color: "#2563eb",
                                                            cursor: "pointer",
                                                            fontSize: "0.85rem",
                                                            fontWeight: "600",
                                                            display: "inline-flex",
                                                            alignItems: "center",
                                                            gap: "4px"
                                                        }}
                                                    >
                                                        <RiEditLine /> Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeletingRecord(log)}
                                                        title="Delete Attendance"
                                                        style={{
                                                            padding: "6px 10px",
                                                            borderRadius: "6px",
                                                            border: "1px solid #ef4444",
                                                            background: "rgba(239, 68, 68, 0.1)",
                                                            color: "#dc2626",
                                                            cursor: "pointer",
                                                            fontSize: "0.85rem",
                                                            fontWeight: "600",
                                                            display: "inline-flex",
                                                            alignItems: "center",
                                                            gap: "4px"
                                                        }}
                                                    >
                                                        <RiDeleteBinLine /> Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Edit Attendance Modal */}
            {editingRecord && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    backdropFilter: "blur(4px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 2000,
                }}>
                    <div style={{
                        background: "var(--bg-card, #ffffff)",
                        padding: "24px",
                        borderRadius: "16px",
                        width: "400px",
                        maxWidth: "90%",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
                        border: "1px solid var(--border-color, #e2e8f0)"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                            <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "700" }}>Edit Attendance</h3>
                            <button
                                type="button"
                                onClick={() => setEditingRecord(null)}
                                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "#64748b" }}
                            >
                                <RiCloseLine />
                            </button>
                        </div>
                        <form onSubmit={handleSaveEdit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                            <div className="form-group">
                                <label className="form-label">Student Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    disabled={editLoading}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select
                                    className="form-input form-select"
                                    value={editStatus}
                                    onChange={(e) => setEditStatus(e.target.value)}
                                    disabled={editLoading}
                                >
                                    <option value="Present">Present</option>
                                    <option value="Absent">Absent</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Date</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={editDate}
                                    onChange={(e) => setEditDate(e.target.value)}
                                    disabled={editLoading}
                                    required
                                />
                            </div>
                            <div style={{ display: "flex", gap: "10px", marginTop: "10px", justifyContent: "flex-end" }}>
                                <button
                                    type="button"
                                    onClick={() => setEditingRecord(null)}
                                    disabled={editLoading}
                                    style={{
                                        padding: "8px 14px",
                                        borderRadius: "8px",
                                        border: "1px solid #cbd5e1",
                                        background: "transparent",
                                        cursor: "pointer",
                                        fontWeight: "600"
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editLoading}
                                    style={{
                                        padding: "8px 16px",
                                        borderRadius: "8px",
                                        border: "none",
                                        background: "#75070C",
                                        color: "#ffffff",
                                        cursor: editLoading ? "not-allowed" : "pointer",
                                        fontWeight: "600",
                                        opacity: editLoading ? 0.7 : 1
                                    }}
                                >
                                    {editLoading ? "Updating..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Custom EduPath AI Deletion Confirmation Modal */}
            <ConfirmModal
                isOpen={!!deletingRecord}
                title="Delete Attendance Record?"
                itemName={deletingRecord?.name || deletingRecord?.studentName || "Student Attendance"}
                onConfirm={handleConfirmDelete}
                onClose={() => setDeletingRecord(null)}
                loading={deleteLoading}
            />
        </div>
    );
};

export default AttendanceForm;
