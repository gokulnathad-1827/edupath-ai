import React, { useState, useEffect } from "react";
import Card from "../../components/common/Card";
import {
  RiFileChartLine,
  RiCheckDoubleLine,
  RiTimeLine,
  RiAlertLine,
  RiShieldLine,
  RiShieldCheckLine,
} from "react-icons/ri";
import useAuth from "../hooks/useAuth";
import { edupathApi } from "../../services/edupathApi";

const Reports = () => {
    const { user } = useAuth();
    const [isExporting, setIsExporting] = useState(false);
    const [loading, setLoading] = useState(true);

    const [reportSummary, setReportSummary] = useState({
        totalSessions: 0,
        completed: 0,
        pending: 0,
        atRiskStudents: 0,
    });

    const [monthlyReports, setMonthlyReports] = useState([]);
    const [riskBreakdown, setRiskBreakdown] = useState({
        high: 0,
        medium: 0,
        low: 0,
        noRisk: 0,
    });

    useEffect(() => {
        const fetchReport = async () => {
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
                    const rep = await edupathApi.getCounselorReport(counselor.id).catch(() => null);
                    if (rep) {
                        setReportSummary({
                            totalSessions: rep.totalSessions || 0,
                            completed: rep.completedSessions || 0,
                            pending: rep.pendingSessions || 0,
                            atRiskStudents: rep.atRiskStudentsCount || 0,
                        });
                        setMonthlyReports(rep.monthlyReports || []);
                        setRiskBreakdown({
                            high: rep.highRiskCount || 0,
                            medium: rep.mediumRiskCount || 0,
                            low: rep.lowRiskCount || 0,
                            noRisk: rep.noRiskCount || 0,
                        });
                    }
                }
            } catch (err) {
                console.error("[Counselor Reports Fetch Error]", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [user]);

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            const csvRows = [];
            csvRows.push("EduPath AI - Counselor Report Summary");
            csvRows.push("");
            csvRows.push("Total Sessions,Completed,Pending,At-Risk Students");
            csvRows.push(`${reportSummary.totalSessions},${reportSummary.completed},${reportSummary.pending},${reportSummary.atRiskStudents}`);
            csvRows.push("");
            
            csvRows.push("Monthly Counseling Report");
            csvRows.push("Month,Total Sessions,Completed,Pending");
            monthlyReports.forEach(r => {
                csvRows.push(`${r.month},${r.sessions},${r.completed},${r.pending}`);
            });
            csvRows.push("");
            
            csvRows.push("Student Risk Breakdown");
            csvRows.push("Risk Level,Count,Status");
            csvRows.push(`High Risk,${riskBreakdown.high},Critical`);
            csvRows.push(`Medium Risk,${riskBreakdown.medium},Monitor`);
            csvRows.push(`Low Risk,${riskBreakdown.low},Stable`);
            csvRows.push(`No Risk,${riskBreakdown.noRisk},Safe`);

            const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `counselor_monthly_report_${new Date().toISOString().slice(0,10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setIsExporting(false);
        }, 1000);
    };

    return (
        <div className="dashboard animate-fade-in">
            {/* Header */}
            <div className="dash-welcome">
                <div className="dash-welcome-text">
                    <h1>Counselor Reports 📊</h1>
                    <p>View counseling session histories and student risk summaries.</p>
                </div>
                <button 
                    className="dash-quick-action"
                    onClick={handleExport}
                    disabled={isExporting}
                >
                    {isExporting ? "Compiling Report..." : "Export Report"}
                </button>
            </div>

            {/* Summary Cards */}
            <div className="dash-stats">
                <Card
                    icon={<RiFileChartLine />}
                    title="Total Sessions"
                    value={reportSummary.totalSessions}
                    badge="Cumulative"
                    badgeType="primary"
                    hoverable
                />

                <Card
                    icon={<RiCheckDoubleLine />}
                    title="Completed"
                    value={reportSummary.completed}
                    badge={reportSummary.totalSessions > 0 ? `${Math.round((reportSummary.completed / reportSummary.totalSessions) * 100)}% Done` : "0% Done"}
                    badgeType="success"
                    hoverable
                />

                <Card
                    icon={<RiTimeLine />}
                    title="Pending"
                    value={reportSummary.pending}
                    badge="Active"
                    badgeType="warning"
                    hoverable
                />

                <Card
                    icon={<RiAlertLine />}
                    title="At-Risk Students"
                    value={reportSummary.atRiskStudents}
                    badge="Alert"
                    badgeType="danger"
                    hoverable
                />
            </div>

            {/* Monthly Reports Table */}
            <div className="dash-tasks-card">
                <div className="dash-section-title">
                    <h3>Monthly Counseling Report</h3>
                </div>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th>Total Sessions</th>
                                <th>Completed</th>
                                <th>Pending</th>
                            </tr>
                        </thead>
                        <tbody>
                            {monthlyReports.map((report, index) => (
                                <tr key={index}>
                                    <td><strong>{report.month}</strong></td>
                                    <td>{report.sessions}</td>
                                    <td>{report.completed}</td>
                                    <td>{report.pending}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Student Risk Statistics */}
            <div className="dash-tasks-card">
                <div className="dash-section-title">
                    <h3>Student Risk Breakdown</h3>
                </div>
                <div className="dash-stats">
                    <Card
                        icon={<RiAlertLine />}
                        title="High Risk"
                        value={riskBreakdown.high}
                        badge="Critical"
                        badgeType="danger"
                        hoverable
                    />

                    <Card
                        icon={<RiAlertLine />}
                        title="Medium Risk"
                        value={riskBreakdown.medium}
                        badge="Monitor"
                        badgeType="warning"
                        hoverable
                    />

                    <Card
                        icon={<RiShieldLine />}
                        title="Low Risk"
                        value={riskBreakdown.low}
                        badge="Stable"
                        badgeType="success"
                        hoverable
                    />

                    <Card
                        icon={<RiShieldCheckLine />}
                        title="No Risk"
                        value={riskBreakdown.noRisk}
                        badge="Safe"
                        badgeType="success"
                        hoverable
                    />
                </div>
            </div>
        </div>
    );
};

export default Reports;