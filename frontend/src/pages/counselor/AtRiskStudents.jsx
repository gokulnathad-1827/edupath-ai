import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { edupathApi } from "../../services/edupathApi";

const AtRiskStudents = () => {
    const { user } = useAuth();
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchCounselorStudents = async () => {
            try {
                setLoading(true);
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

                if (counselor?.id) {
                    const risks = await edupathApi.getCounselorStudentsDropoutRisk(counselor.id).catch(() => []);
                    if (Array.isArray(risks)) {
                        const mapped = risks.map((r, idx) => {
                            const risk = r.dropoutRisk || r.dropout_risk || 'Low';
                            const feat = r.featureSummary || r.feature_summary || {};
                            const att = feat.attendance_percentage ? `${feat.attendance_percentage}%` : 'N/A';
                            const score = feat.current_percentage ? `${feat.current_percentage}%` : 'N/A';

                            let action = "Regular Follow-up";
                            let badgeType = "success";
                            if (risk === "High") {
                                action = "Immediate Counseling / Parent Meeting";
                                badgeType = "danger";
                            } else if (risk === "Medium") {
                                action = "Monitor Progress";
                                badgeType = "warning";
                            }

                            return {
                                id: r.studentId || idx + 1,
                                name: r.studentName || `Student ${r.studentId}`,
                                classSection: `Class ${feat.grade || 10}`,
                                attendance: att,
                                score: score,
                                risk: risk,
                                action: action,
                                badgeType: badgeType,
                            };
                        });
                        setStudents(mapped);
                    }
                }
            } catch (err) {
                console.error("[Counselor At-Risk Fetch Error]", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCounselorStudents();
    }, [user]);

    const filteredStudents = students.filter((student) =>
        student.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="dashboard animate-fade-in">
            <div className="dash-welcome">
                <div className="dash-welcome-text">
                    <h1>At-Risk Students ⚠️</h1>
                    <p>Monitor students who require counseling or academic support based on AI indicators.</p>
                </div>
            </div>

            <div className="dash-tasks-card">
                <div className="form-group search-box">
                    <input
                        type="text"
                        placeholder="Search student by name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="form-input"
                    />
                </div>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Class / Section</th>
                            <th>Attendance</th>
                            <th>Academic Score</th>
                            <th>Risk Level</th>
                            <th>Recommended Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredStudents.map((student) => (
                            <tr key={student.id}>
                                <td>{student.id}</td>
                                <td><strong>{student.name}</strong></td>
                                <td>{student.classSection}</td>
                                <td>{student.attendance}</td>
                                <td>{student.score}</td>
                                <td>
                                    <span className={`badge badge-${student.badgeType}`}>
                                        {student.risk}
                                    </span>
                                </td>
                                <td>{student.action}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AtRiskStudents;