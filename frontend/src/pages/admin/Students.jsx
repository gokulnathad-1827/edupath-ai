import React, { useEffect, useState } from "react";
import Table from "../../components/common/Table";
import Modal from "../../components/common/Modal";
import ConfirmModal from "../../components/common/ConfirmModal";
import { getStudents, addStudent, updateStudent, deleteStudent } from "../../services/studentService";
import { RiCheckboxCircleLine, RiErrorWarningLine } from "react-icons/ri";

const Students = () => {
    const [students, setStudents] = useState([]);
    const [alertMsg, setAlertMsg] = useState({ text: "", type: "" });
    const [loading, setLoading] = useState(false);

    // New Student Form State
    const [form, setForm] = useState({
        name: "",
        department: "Class 10-A",
        attendance: "90%",
        score: "80%",
        risk: "Low",
        action: "Regular Follow-up"
    });

    // Edit Modal State
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editStudent, setEditStudent] = useState({
        id: null,
        fullName: "",
        email: "",
        phoneNumber: "",
        address: "",
        className: "10",
        section: "A",
        status: "ACTIVE"
    });
    const [updating, setUpdating] = useState(false);

    // Delete Confirm Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [targetStudent, setTargetStudent] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const data = await getStudents();
            setStudents([...data]);
        } catch (err) {
            console.error("[Admin Students Error] Failed to fetch roster:", err);
            triggerAlert(err?.message || "Failed to load students from database.", "error");
        }
    };

    const triggerAlert = (text, type = "success") => {
        setAlertMsg({ text, type });
        setTimeout(() => setAlertMsg({ text: "", type: "" }), 4000);
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) {
            triggerAlert("Please enter a student name.", "error");
            return;
        }

        let recommendedAction = "Regular Follow-up";
        if (form.risk === "High") recommendedAction = "Immediate Counseling";
        else if (form.risk === "Medium") recommendedAction = "Monitor Progress";

        const studentData = {
            name: form.name.trim(),
            classSection: form.department,
            attendance: form.attendance,
            score: form.score,
            risk: form.risk,
            action: recommendedAction
        };

        try {
            setLoading(true);
            await addStudent(studentData);
            triggerAlert(`✓ Successfully saved student "${form.name.trim()}" to database`, "success");
            
            setForm({
                name: "",
                department: "Class 10-A",
                attendance: "90%",
                score: "80%",
                risk: "Low",
                action: "Regular Follow-up"
            });
            await fetchStudents();
        } catch (err) {
            console.error("[Admin Students Error] Save failed:", err);
            const errMsg = err?.response?.data?.message || err?.message || "Failed to save student. Please try again.";
            triggerAlert(`✕ ${errMsg}`, "error");
        } finally {
            setLoading(false);
        }
    };

    // Open Edit Modal
    const handleEditClick = (row) => {
        const raw = row.rawRecord || {};
        const classParts = (row.classSection || 'Class 10-A').replace('Class ', '').split('-');
        setEditStudent({
            id: row.id,
            fullName: raw.fullName || row.name || "",
            email: raw.email || "",
            phoneNumber: raw.phoneNumber || "",
            address: raw.address || "",
            className: raw.className || classParts[0] || "10",
            section: raw.section || classParts[1] || "A",
            status: raw.status || "ACTIVE"
        });
        setEditModalOpen(true);
    };

    // Submit Edit Student (PUT /api/students/{id})
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        if (!editStudent.fullName.trim()) {
            triggerAlert("Student full name is required.", "error");
            return;
        }

        try {
            setUpdating(true);
            await updateStudent(editStudent.id, {
                fullName: editStudent.fullName.trim(),
                email: editStudent.email.trim() || null,
                phoneNumber: editStudent.phoneNumber.trim() || null,
                address: editStudent.address.trim() || null,
                className: editStudent.className.trim(),
                section: editStudent.section.trim(),
                status: editStudent.status
            });

            triggerAlert("✓ Student updated successfully", "success");
            setEditModalOpen(false);
            await fetchStudents();
        } catch (err) {
            console.error("[Admin Students Error] Update failed:", err);
            const errMsg = err?.response?.data?.message || err?.message || "Failed to update student. Please try again.";
            triggerAlert(`✕ ${errMsg}`, "error");
        } finally {
            setUpdating(false);
        }
    };

    // Request Delete Modal
    const handleDeleteRequest = (id, name, row) => {
        setTargetStudent({ id, name: name || row?.name || `Student #${id}` });
        setDeleteModalOpen(true);
    };

    // Execute Delete Student (DELETE /api/students/{id})
    const handleConfirmDelete = async () => {
        if (!targetStudent || !targetStudent.id) return;

        try {
            setDeleting(true);
            await deleteStudent(targetStudent.id);
            triggerAlert("✓ Student deleted successfully", "success");
            setDeleteModalOpen(false);
            setTargetStudent(null);
            await fetchStudents();
        } catch (err) {
            console.error("[Admin Students Error] Delete failed:", err);
            const errMsg = err?.response?.data?.message || err?.message || "Failed to delete student. Please try again.";
            triggerAlert(`✕ ${errMsg}`, "error");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="dashboard animate-fade-in">
            <div className="dash-welcome">
                <div className="dash-welcome-text">
                    <h1>Student Directory 👥</h1>
                    <p>Manage registered students and view their academic status in the database.</p>
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
                            <h3 style={{ color: "var(--text-primary)", fontSize: "1.1rem", marginBottom: "4px" }}>Add New Student</h3>
                            <div className="form-group">
                                <label className="form-label" style={{ marginBottom: "4px" }}>Name</label>
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="Student Name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ marginBottom: "4px" }}>Class / Section</label>
                                <select 
                                    name="department" 
                                    value={form.department} 
                                    onChange={handleChange} 
                                    disabled={loading}
                                    className="form-input form-select"
                                >
                                    <option value="Class 10-A">Class 10-A</option>
                                    <option value="Class 9-A">Class 9-A</option>
                                    <option value="Class 11-A">Class 11-A</option>
                                    <option value="Class 12-A">Class 12-A</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ marginBottom: "4px" }}>Risk Level</label>
                                <select 
                                    name="risk" 
                                    value={form.risk} 
                                    onChange={handleChange} 
                                    disabled={loading}
                                    className="form-input form-select"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                style={{ 
                                    padding: "10px 16px", 
                                    borderRadius: "8px", 
                                    border: "none", 
                                    background: loading ? "#a53036" : "#75070C", 
                                    color: "#fff", 
                                    cursor: loading ? "not-allowed" : "pointer",
                                    fontWeight: "600",
                                    marginTop: "12px"
                                }}
                            >
                                {loading ? "Saving..." : "Save Student"}
                            </button>
                        </form>

                        {/* Right: Table */}
                        <div style={{ flex: 1, minWidth: "300px" }}>
                            <h3 style={{ color: "var(--text-primary)", fontSize: "1.1rem", marginBottom: "16px" }}>Student Roster</h3>
                            <div className="table-container">
                                <Table data={students} onEdit={handleEditClick} onDelete={handleDeleteRequest} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Student Modal */}
            <Modal isOpen={editModalOpen} title="Edit Student Profile ✏️" onClose={() => !updating && setEditModalOpen(false)}>
                <form onSubmit={handleUpdateSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            value={editStudent.fullName}
                            onChange={(e) => setEditStudent({ ...editStudent, fullName: e.target.value })}
                            required
                            disabled={updating}
                            className="form-input"
                        />
                    </div>

                    <div style={{ display: "flex", gap: "12px" }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Class</label>
                            <input
                                type="text"
                                placeholder="10"
                                value={editStudent.className}
                                onChange={(e) => setEditStudent({ ...editStudent, className: e.target.value })}
                                required
                                disabled={updating}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Section</label>
                            <input
                                type="text"
                                placeholder="A"
                                value={editStudent.section}
                                onChange={(e) => setEditStudent({ ...editStudent, section: e.target.value })}
                                required
                                disabled={updating}
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            placeholder="student@edupath.com"
                            value={editStudent.email}
                            onChange={(e) => setEditStudent({ ...editStudent, email: e.target.value })}
                            disabled={updating}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input
                            type="text"
                            placeholder="+91 9876543210"
                            value={editStudent.phoneNumber}
                            onChange={(e) => setEditStudent({ ...editStudent, phoneNumber: e.target.value })}
                            disabled={updating}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Address</label>
                        <input
                            type="text"
                            placeholder="Street Address, City"
                            value={editStudent.address}
                            onChange={(e) => setEditStudent({ ...editStudent, address: e.target.value })}
                            disabled={updating}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Status</label>
                        <select
                            value={editStudent.status}
                            onChange={(e) => setEditStudent({ ...editStudent, status: e.target.value })}
                            disabled={updating}
                            className="form-input form-select"
                        >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="INACTIVE">INACTIVE</option>
                            <option value="SUSPENDED">SUSPENDED</option>
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
                title="Delete Student?"
                itemName={targetStudent?.name || ""}
                onConfirm={handleConfirmDelete}
                onClose={() => !deleting && setDeleteModalOpen(false)}
                loading={deleting}
            />
        </div>
    );
};

export default Students;