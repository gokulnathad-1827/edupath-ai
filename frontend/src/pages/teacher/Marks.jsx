import React from "react";
import MarksForm from "../../components/forms/MarksForm";

const Marks = () => {
    return (
        <div className="dashboard animate-fade-in">
            <div className="dash-welcome">
                <div className="dash-welcome-text">
                    <h1>Marks Entry 📝</h1>
                    <p>Select a student and record their academic scores.</p>
                </div>
            </div>

            <div className="dash-tasks-card">
                <MarksForm />
            </div>
        </div>
    );
};

export default Marks;