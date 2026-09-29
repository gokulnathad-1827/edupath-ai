import React from "react";

const Loader = () => {
    return (
        <div
            className="flex-center"
            style={{
                height: "100vh",
                flexDirection: "column",
            }}
        >
            <div
                style={{
                    width: "50px",
                    height: "50px",
                    border: "5px solid #ccc",
                    borderTop: "5px solid #2563eb",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                }}
            ></div>

            <p style={{ marginTop: "15px" }}>Loading...</p>

            {/* Spinner animation */}
            <style>
                {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
            </style>
        </div>
    );
};

export default Loader;