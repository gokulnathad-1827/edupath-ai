import React, { useState, useEffect } from "react";
import Table from "../../components/common/Table";
import Modal from "../../components/common/Modal";
import ConfirmModal from "../../components/common/ConfirmModal";
import { RiCheckboxCircleLine, RiErrorWarningLine } from "react-icons/ri";
import { edupathApi } from "../../services/edupathApi";

const Teachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alertMsg, setAlertMsg] = useState({ text: "", type: "" });
    const [newTeacher, setNewTeacher] = useState({ name: "", subject: "" });

    // Edit Modal State
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editTeacher, setEditTeacher] = useState({
        id: null,
        fullName: "",
        subject: "",
        qualification: "",
        experience: 5,
        status: "ACTIVE"
    });
    const [updating, setUpdating] = useState(false);

    // Delete Confirm Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [targetTeacher, setTargetTeacher] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchTeachers = async () => {
        try {
            setLoading(true);
            const data = await edupathApi.getAllTeachers();
            if (Array.isArray(data)) {
                setTeachers(
                    data.map((t) => ({
                        id: t.id,
                        name: t.fullName || t.name || "Teacher",
                        subject: t.subject || t.specialization || t.department || "General",
                        status: t.status || "ACTIVE",
                        rawRecord: t,
                    }))
                );
            }
        } catch (err) {
            console.error("[Teacher API Load Error]", err);
            triggerAlert("Failed to load teachers from backend database.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const triggerAlert = (text, type = "success") => {
        setAlertMsg({ text, type });
        setTimeout(() => setAlertMsg({ text: "", type: "" }), 4000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newTeacher.name.trim()) {
            triggerAlert("Please enter teacher's name.", "error");
            return;
        }
        if (!newTeacher.subject.trim()) {
            triggerAlert("Please enter teacher's subject.", "error");
            return;
        }
        
        try {
            setLoading(true);
            const created = await edupathApi.createTeacher({
                fullName: newTeacher.name.trim(),
                subject: newTeacher.subject.trim(),
                specialization: newTeacher.subject.trim(),
                department: newTeacher.subject.trim(),
            });

            triggerAlert(`✓ Added teacher "${created.fullName || newTeacher.name.trim()}" successfully`, "success");
            setNewTeacher({ name: "", subject: "" });
            await fetchTeachers();
        } catch (err) {
            console.error("[Teacher API Save Error]", err);
            const errMsg = err?.response?.data?.message || err?.message || "Failed to save teacher to database.";
            triggerAlert(`✕ ${errMsg}`, "error");
        } finally {
            setLoading(false);
        }
    };

    // Open Edit Modal
    const handleEditClick = (row) => {
        const raw = row.rawRecord || {};
        setEditTeacher({
            id: row.id,
            fullName: raw.fullName || raw.name || row.name || "",
            subject: raw.subject || raw.specialization || raw.department || row.subject || "",
            qualification: raw.qualification || "M.Sc, B.Ed",
            experience: raw.experience !== undefined && raw.experience !== null ? raw.experience : 5,
            status: raw.status || row.status || "ACTIVE"
        });
        setEditModalOpen(true);
    };

    // Submit Edit Teacher (PUT /api/teachers/{id})
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        if (!editTeacher.fullName.trim()) {
            triggerAlert("Teacher full name is required.", "error");
            return;
        }
        if (!editTeacher.subject.trim()) {
            triggerAlert("Subject assignment is required.", "error");
            return;
        }

        try {
            setUpdating(true);
            await edupathApi.updateTeacher(editTeacher.id, {
                fullName: editTeacher.fullName.trim(),
                name: editTeacher.fullName.trim(),
                subject: editTeacher.subject.trim(),
                specialization: editTeacher.subject.trim(),
                department: editTeacher.subject.trim(),
                qualification: editTeacher.qualification.trim(),
                experience: Number(editTeacher.experience) || 0,
                status: editTeacher.status
            });

            triggerAlert("✓ Teacher updated successfully", "success");
            setEditModalOpen(false);
            await fetchTeachers();
        } catch (err) {
            console.error("[Teacher API Update Error]", err);
            const errMsg = err?.response?.data?.message || err?.message || "Failed to update teacher. Please try again.";
            triggerAlert(`✕ ${errMsg}`, "error");
        } finally {
            setUpdating(false);
        }
    };

    // Request Delete Modal
    const handleDeleteRequest = (id, name, row) => {
        setTargetTeacher({ id, name: name || row?.name || `Teacher #${id}` });
        setDeleteModalOpen(true);
    };

    // Execute Delete Teacher (DELETE /api/teachers/{id})
    const handleConfirmDelete = async () => {
        if (!targetTeacher || !targetTeacher.id) return;

        try {
            setDeleting(true);
            await edupathApi.deleteTeacher(targetTeacher.id);
            triggerAlert("✓ Teacher deleted successfully", "success");
            setDeleteModalOpen(false);
            setTargetTeacher(null);
            await fetchTeachers();
        } catch (err) {
            console.error("[Teacher API Delete Error]", err);
            const errMsg = err?.response?.data?.message || err?.message || "Failed to delete teacher. Please try again.";
            triggerAlert(`✕ ${errMsg}`, "error");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="dashboard animate-fade-in">
            <div className="dash-welcome">
                <div className="dash-welcome-text">
                    <h1>Teachers Directory 👨‍🏫</h1>
                    <p>Manage school teachers and subject assignments in database.</p>
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
                        {/* Left: Form */}
                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", width: "300px", flexShrink: 0 }}>
                            <h3 style={{ color: "var(--text-primary)", fontSize: "1.1rem", marginBottom: "4px" }}>Add New Teacher</h3>
                            
                            <div className="form-group">
                                <label className="form-label" style={{ marginBottom: "4px" }}>Teacher Name</label>
                                <input
                                    type="text"
                                    placeholder="Teacher Name (e.g. Mr. Kumar)"
                                    value={newTeacher.name}
                                    onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                                    required
                                    disabled={loading}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ marginBottom: "4px" }}>Subject Assignment</label>
                                <input
                                    type="text"
                                    placeholder="Subject (e.g. Physics)"
                                    value={newTeacher.subject}
                                    onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
                                    required
                                    disabled={loading}
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
                                    marginTop: "12px",
                                    opacity: loading ? 0.7 : 1
                                }}
                            >
                                {loading ? "Saving..." : "Save Teacher"}
                            </button>
                        </form>

                        {/* Right: Table */}
                        <div style={{ flex: 1, minWidth: "300px" }}>
                            <h3 style={{ color: "var(--text-primary)", fontSize: "1.1rem", marginBottom: "16px" }}>Teacher Roster</h3>
                            <div className="table-container">
                                <Table data={teachers} onEdit={handleEditClick} onDelete={handleDeleteRequest} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Teacher Modal */}
            <Modal isOpen={editModalOpen} title="Edit Teacher Profile ✏️" onClose={() => !updating && setEditModalOpen(false)}>
                <form onSubmit={handleUpdateSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div className="form-group">
                        <label className="form-label">Teacher Name</label>
                        <input
                            type="text"
                            value={editTeacher.fullName}
                            onChange={(e) => setEditTeacher({ ...editTeacher, fullName: e.target.value })}
                            required
                            disabled={updating}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Subject / Specialization</label>
                        <input
                            type="text"
                            value={editTeacher.subject}
                            onChange={(e) => setEditTeacher({ ...editTeacher, subject: e.target.value })}
                            required
                            disabled={updating}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Qualification</label>
                        <input
                            type="text"
                            value={editTeacher.qualification}
                            onChange={(e) => setEditTeacher({ ...editTeacher, qualification: e.target.value })}
                            disabled={updating}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Years of Experience</label>
                        <input
                            type="number"
                            min="0"
                            value={editTeacher.experience}
                            onChange={(e) => setEditTeacher({ ...editTeacher, experience: e.target.value })}
                            disabled={updating}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Status</label>
                        <select
                            value={editTeacher.status}
                            onChange={(e) => setEditTeacher({ ...editTeacher, status: e.target.value })}
                            disabled={updating}
                            className="form-input form-select"
                        >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="INACTIVE">INACTIVE</option>
                            <option value="ON_LEAVE">ON_LEAVE</option>
                        </select>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px" }}>
                        <button
                            type="button"
                            onClick={() => setEditModalOpen(false)}
                            disabled={updating}
                            style={{
                                padding: "8px 16px",
                                borderRadius: "8px",
                                border: "1px solid var(--border-color, #cbd5e1)",
                                background: "transparent",
                                color: "var(--text-primary)",
                                cursor: updating ? "not-allowed" : "pointer",
                                fontWeight: "600"
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={updating}
                            style={{
                                padding: "8px 20px",
                                borderRadius: "8px",
                                border: "none",
                                background: "#75070C",
                                color: "#ffffff",
                                cursor: updating ? "not-allowed" : "pointer",
                                fontWeight: "600",
                                opacity: updating ? 0.7 : 1
                            }}
                        >
                            {updating ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Custom Confirm Delete Modal */}
            <ConfirmModal
                isOpen={deleteModalOpen}
                title="Delete Teacher?"
                itemName={targetTeacher?.name || ""}
                onConfirm={handleConfirmDelete}
                onClose={() => !deleting && setDeleteModalOpen(false)}
                loading={deleting}
            />
        </div>
    );
};

export default Teachers;