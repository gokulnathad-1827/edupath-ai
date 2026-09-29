import React, { useState, useEffect } from "react";
import { edupathApi } from "../../services/edupathApi";

const Classes = () => {
    const [classList, setClassList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                setLoading(true);
                const data = await edupathApi.getAdminClassSummaries();
                if (Array.isArray(data)) {
                    setClassList(data);
                }
            } catch (err) {
                console.error("[Admin Classes Error]", err);
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);

    return (
        <div className="dashboard animate-fade-in">
            <div className="dash-welcome">
                <div className="dash-welcome-text">
                    <h1>Classrooms & Scheduling 🏫</h1>
                    <p>Overview of active classes and student enrollment.</p>
                </div>
            </div>

            <div className="schedule-card">
                <div className="schedule-list">
                    {loading ? (
                        <div style={{ padding: "20px", textAlign: "center", color: "var(--text-secondary)" }}>Loading classes...</div>
                    ) : classList.length === 0 ? (
                        <div style={{ padding: "20px", textAlign: "center", color: "var(--text-secondary)" }}>No active classes found in the system.</div>
                    ) : (
                        classList.map((cls, idx) => (
                            <div key={idx} className="schedule-item">
                                <div className="schedule-details">
                                    <span className="schedule-subject">{cls.name}</span>
                                    <div className="schedule-meta">
                                        <span className="schedule-meta-item">{cls.department} • Teacher: {cls.teacherName || "Unassigned"}</span>
                                    </div>
                                </div>
                                <span className="schedule-room">{cls.strength} Students</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Classes;