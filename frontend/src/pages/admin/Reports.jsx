import React, { useState } from "react";
import { edupathApi } from "../../services/edupathApi";

const Reports = () => {
    const [exportingStudent, setExportingStudent] = useState(false);
    const [exportingTeacher, setExportingTeacher] = useState(false);

    const downloadCSV = (filename, headers, rows) => {
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportStudents = async () => {
        setExportingStudent(true);
        try {
            const data = await edupathApi.getAdminStudentReports();
            const headers = ["ID", "Name", "Class & Section", "Attendance", "Average Score", "Risk Level", "Current Action"];
            const rows = Array.isArray(data) ? data.map(s => [
                s.id,
                s.name,
                s.classAndSection,
                s.attendance,
                s.averageScore,
                s.riskLevel,
                s.currentAction
            ]) : [];
            downloadCSV("edupath_student_report.csv", headers, rows);
        } catch (err) {
            console.error("[Export Students Report Error]", err);
        } finally {
            setExportingStudent(false);
        }
    };

    const handleExportTeachers = async () => {
        setExportingTeacher(true);
        try {
            const data = await edupathApi.getAdminTeacherReports();
            const headers = ["Employee ID", "Name", "Subject", "Qualification", "Classes Assigned", "Status"];
            const rows = Array.isArray(data) ? data.map(t => [
                t.employeeId,
                t.name,
                t.subject,
                t.qualification,
                t.classesAssigned,
                t.status
            ]) : [];
            downloadCSV("edupath_teacher_logs.csv", headers, rows);
        } catch (err) {
            console.error("[Export Teachers Log Error]", err);
        } finally {
            setExportingTeacher(false);
        }
    };

    return (
        <div className="dashboard animate-fade-in">
            <div className="dash-welcome">
                <div className="dash-welcome-text">
                    <h1>Administrative Reports 📊</h1>
                    <p>Export academic analytics and dropout risk reports.</p>
                </div>
            </div>

            <div className="dash-tasks-card">
                <p className="dash-stat-sub">Monthly metrics are compiled. Select a report type to download.</p>
                
                <div className="actions-grid" style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                    <button 
                        className="dash-quick-action" 
                        onClick={handleExportStudents}
                        disabled={exportingStudent}
                    >
                        {exportingStudent ? "Compiling Student Report..." : "Export Student Report"}
                    </button>
                    <button 
                        className="dash-quick-action" 
                        onClick={handleExportTeachers}
                        disabled={exportingTeacher}
                    >
                        {exportingTeacher ? "Compiling Teacher Logs..." : "Export Teacher Logs"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Reports;