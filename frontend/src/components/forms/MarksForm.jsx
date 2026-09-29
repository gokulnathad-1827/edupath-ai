import React, { useState, useEffect } from "react";
import { addMarks, getMarks, updateMarks, deleteMarks } from "../../pages/services/academicService";
import ConfirmModal from "../common/ConfirmModal";
import { RiCheckboxCircleLine, RiErrorWarningLine, RiEditLine, RiDeleteBinLine, RiCloseLine } from "react-icons/ri";

const SUBJECT_OPTIONS = [
    "Mathematics",
    "Science",
    "English",
    "Social Science",
    "Computer Science",
    "Tamil",
    "Physics",
    "Chemistry"
];

const MarksForm = () => {
    const [name, setName] = useState("");
    const [subject, setSubject] = useState("Mathematics");
    const [marks, setMarks] = useState("");
    const [marksList, setMarksList] = useState([]);
    const [alertMsg, setAlertMsg] = useState({ text: "", type: "" });
    const [loading, setLoading] = useState(false);

    // Edit Modal State
    const [editingRecord, setEditingRecord] = useState(null);
    const [editName, setEditName] = useState("");
    const [editSubject, setEditSubject] = useState("Mathematics");
    const [editMarks, setEditMarks] = useState("");
    const [editDate, setEditDate] = useState("");
    const [editLoading, setEditLoading] = useState(false);

    // Delete Modal State
    const [deletingRecord, setDeletingRecord] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        loadMarks();
    }, []);

    const loadMarks = async () => {
        try {
            const list = await getMarks();
            if (Array.isArray(list)) {
                setMarksList([...list]);
            }
        } catch (err) {
            console.error("[Marks Load Error]", err);
            triggerAlert("Failed to load marks from server.", "error");
        }
    };

    const triggerAlert = (text, type = "success") => {
        setAlertMsg({ text, type });
        setTimeout(() => setAlertMsg({ text: "", type: "" }), 4000);
    };

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

        if (!name.trim() || !marks.trim()) {
            triggerAlert("Please enter student name and marks.", "error");
            return;
        }

        try {
            setLoading(true);
            await addMarks({
                name: name.trim(),
                studentName: name.trim(),
                subject: subject || "Mathematics",
                marks: marks.trim()
            });
            triggerAlert(`✓ Saved marks: ${name.trim()} - ${subject} (${marks.trim()})`, "success");
            setName("");
            setMarks("");
            await loadMarks();
        } catch (err) {
            console.error("[Marks Save Error]", err);
            const errMsg = err?.response?.data?.message || err?.message || "Failed to save marks to backend database.";
            triggerAlert(`✕ ${errMsg}`, "error");
        } finally {
            setLoading(false);
        }
    };

    // Open Edit Modal
    const handleOpenEdit = (log) => {
        setEditingRecord(log);
        setEditName(log.name || log.studentName || "");
        setEditSubject(log.subject || "Mathematics");
        setEditMarks(log.marks || "");
        setEditDate(log.date || new Date().toISOString().split("T")[0]);
    };

    // Submit Edit Form
    const handleSaveEdit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!editingRecord) return;

        if (!editName.trim() || !editMarks.trim()) {
            triggerAlert("Please enter student name and marks.", "error");
            return;
        }

        try {
            setEditLoading(true);
            await updateMarks(editingRecord.id, {
                name: editName.trim(),
                studentName: editName.trim(),
                subject: editSubject,
                marks: editMarks.trim(),
                date: editDate
            });
            triggerAlert(`✓ Updated marks for ${editName.trim()}`, "success");
            setEditingRecord(null);
            await loadMarks();
        } catch (err) {
            console.error("[Marks Update Error]", err);
            const errMsg = err?.response?.data?.message || err?.message || "Failed to update marks.";
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
            await deleteMarks(deletingRecord.id);
            triggerAlert(`✓ Deleted marks record for ${deletingRecord.name || deletingRecord.studentName}`, "success");
            setDeletingRecord(null);
            await loadMarks();
        } catch (err) {
            console.error("[Marks Delete Error]", err);
            const errMsg = err?.response?.data?.message || err?.message || "Failed to delete marks record.";
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
                        <label className="form-label" style={{ marginBottom: '6px' }}>Subject</label>
                        <select 
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            disabled={loading}
                            className="form-input form-select"
                        >
                            {SUBJECT_OPTIONS.map((sub, idx) => (
                                <option key={idx} value={sub}>{sub}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label" style={{ marginBottom: '6px' }}>Marks</label>
                        <input
                            placeholder="Marks (e.g. 85)"
                            value={marks}
                            onChange={(e) => setMarks(e.target.value)}
                            disabled={loading}
                            required
                            className="form-input"
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
                            cursor: loading ? "not-allowed" : "pointer",
                            fontWeight: "600",
                            marginTop: "8px",
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? "Saving..." : "Save Marks"}
                    </button>
                </form>

                {/* Right: Table */}
                <div style={{ flex: 1, minWidth: "300px" }}>
                    <h3 style={{ marginBottom: "16px", color: "var(--text-primary)", fontSize: "1.1rem" }}>Recorded Student Marks</h3>
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Subject</th>
                                    <th>Marks</th>
                                    <th>Date</th>
                                    <th style={{ textAlign: "center", width: "130px" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {marksList.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: "center" }}>No marks recorded yet.</td>
                                    </tr>
                                ) : (
                                    marksList.map((log, index) => (
                                        <tr key={log.id || index}>
                                            <td><strong>{log.name || log.studentName}</strong></td>
                                            <td>
                                                <span style={{
                                                    padding: "4px 8px",
                                                    borderRadius: "6px",
                                                    background: "rgba(117, 7, 12, 0.08)",
                                                    color: "#75070C",
                                                    fontWeight: "600",
                                                    fontSize: "0.85rem"
                                                }}>
                                                    {log.subject || "General"}
                                                </span>
                                            </td>
                                            <td>
                                                <span style={{ fontWeight: 'bold', color: 'var(--primary, #75070C)' }}>
                                                    {log.marks}
                                                </span>
                                            </td>
                                            <td>{log.date}</td>
                                            <td style={{ textAlign: "center" }}>
                                                <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenEdit(log)}
                                                        title="Edit Marks"
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
                                                        title="Delete Marks"
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

            {/* Edit Marks Modal */}
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
                            <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "700" }}>Edit Marks Record</h3>
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
                                <label className="form-label">Subject</label>
                                <select
                                    className="form-input form-select"
                                    value={editSubject}
                                    onChange={(e) => setEditSubject(e.target.value)}
                                    disabled={editLoading}
                                >
                                    {SUBJECT_OPTIONS.map((sub, idx) => (
                                        <option key={idx} value={sub}>{sub}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Marks</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={editMarks}
                                    onChange={(e) => setEditMarks(e.target.value)}
                                    disabled={editLoading}
                                    required
                                />
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
                title="Delete Marks Record?"
                itemName={deletingRecord?.name || deletingRecord?.studentName || "Student Marks"}
                onConfirm={handleConfirmDelete}
                onClose={() => setDeletingRecord(null)}
                loading={deleteLoading}
            />
        </div>
    );
};

export default MarksForm;