import React from "react";

const Modal = ({ isOpen, title, children, onClose }) => {
    if (!isOpen) return null;

    return (
        <div
            className="flex-center"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                zIndex: 1000,
            }}
        >
            <div
                className="card"
                style={{
                    width: "450px",
                    maxWidth: "90%",
                    padding: "24px",
                    borderRadius: "16px",
                    boxShadow: "var(--shadow-lg)",
                    position: "relative",
                }}
            >
                {/* Header */}
                <div className="flex-between" style={{ marginBottom: "16px" }}>
                    <h3 style={{ margin: 0, fontSize: "1.25rem", color: "var(--text-primary)" }}>{title}</h3>
                    <button
                        onClick={onClose}
                        className="modal-close-btn"
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                </div>

                {/* Body */}
                <div>{children}</div>
            </div>
        </div>
    );
};

export default Modal;