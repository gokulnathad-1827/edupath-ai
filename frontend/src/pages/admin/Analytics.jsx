import React from "react";
import PerformanceChart from "../../components/charts/PerformanceChart";

const Analytics = () => {
    return (
        <div className="dashboard animate-fade-in">
            <div className="dash-welcome">
                <div className="dash-welcome-text">
                    <h1>Academic Analytics 📊</h1>
                    <p>Track class-wide progress and dropout risk parameters.</p>
                </div>
            </div>

            <div className="dash-tasks-card">
                <PerformanceChart />
            </div>
        </div>
    );
};

export default Analytics;