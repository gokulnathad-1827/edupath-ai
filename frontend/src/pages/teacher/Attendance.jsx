import React from "react";
import AttendanceForm from "../../components/forms/AttendanceForm";

const Attendance = () => {
    return (
        <div className="dashboard animate-fade-in">
            <div className="dash-welcome">
                <div className="dash-welcome-text">
                    <h1>Attendance Markings 📅</h1>
                    <p>Select student names and mark their daily attendance.</p>
                </div>
            </div>

            <div className="dash-tasks-card">
                <AttendanceForm />
            </div>
        </div>
    );
};

export default Attendance;