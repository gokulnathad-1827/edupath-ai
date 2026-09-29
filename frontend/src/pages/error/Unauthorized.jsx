import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
    return (
        <div className="error-container">
            <h1 className="error-code">401</h1>

            <h2>Unauthorized Access</h2>

            <p>
                You do not have permission to access this page. Please log in with the
                appropriate account or return to the home page.
            </p>

            <Link to="/" className="action-btn">
                Back to Home
            </Link>
        </div>
    );
};

export default Unauthorized;