import React, { useState, useEffect } from "react";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from "recharts";
import { edupathApi } from "../../services/edupathApi";

const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

const RiskChart = ({ summaryData }) => {
    const [chartData, setChartData] = useState([
        { name: "Low Risk", value: 1 },
        { name: "Medium Risk", value: 1 },
        { name: "High Risk", value: 1 },
    ]);

    useEffect(() => {
        if (summaryData) {
            setChartData([
                { name: "Low Risk", value: summaryData.low_risk || 0 },
                { name: "Medium Risk", value: summaryData.medium_risk || 0 },
                { name: "High Risk", value: summaryData.high_risk || 0 },
            ]);
        } else {
            edupathApi.getDropoutRiskSummary()
                .then((res) => {
                    if (res) {
                        setChartData([
                            { name: "Low Risk", value: res.low_risk || 0 },
                            { name: "Medium Risk", value: res.medium_risk || 0 },
                            { name: "High Risk", value: res.high_risk || 0 },
                        ]);
                    }
                })
                .catch((err) => console.error("[RiskChart AI Error]", err));
        }
    }, [summaryData]);

    return (
        <div
            style={{
                width: "100%",
                height: "350px",
                background: "#fff",
                borderRadius: "10px",
                padding: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
        >
            <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
                Student Risk Analysis (Random Forest AI)
            </h3>

            <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={80}
                        label
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={index}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>

                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RiskChart;