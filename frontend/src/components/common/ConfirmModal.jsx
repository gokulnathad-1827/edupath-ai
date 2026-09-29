import React, { useEffect } from "react";
import { RiErrorWarningLine } from "react-icons/ri";

const ConfirmModal = ({
    isOpen,
    title = "Confirm Deletion",
    itemName = "",
    message,
    onConfirm,
    onClose,
    loading = false,
    confirmText = "Delete",
    cancelText = "Cancel"
}) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isOpen && !loading) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, loading, onClose]);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && !loading) {
            onClose();
        }
    };

    return (
        <div
            onClick={handleBackdropClick}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2000,
                animation: "fadeIn 0.2s ease-in-out",
            }}
        >
            <div
                className="card"
                style={{
                    width: "420px",
                    maxWidth: "92%",
                    padding: "28px 24px",
                    borderRadius: "16px",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
                    position: "relative",
                    textAlign: "center",
                    background: "var(--bg-card, #ffffff)",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                }}
            >
                {/* Warning Icon Container */}
                <div
                    style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "50%",
                        background: "rgba(239, 68, 68, 0.12)",
                        color: "#ef4444",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "2rem",
                        margin: "0 auto 16px auto",
                    }}
                >
                    <RiErrorWarningLine />
                </div>

                {/* Title */}
                <h3
                    style={{
                        margin: "0 0 8px 0",
                        fontSize: "1.3rem",
                        fontWeight: "700",
                        color: "var(--text-primary, #1e293b)",
                    }}
                >
                    {title}
                </h3>

                {/* Message */}
                <p
                    style={{
                        margin: "0 0 24px 0",
                        fontSize: "0.95rem",
                        color: "var(--text-secondary, #64748b)",
                        lineHeight: "1.5",
                    }}
                >
                    {message || (
                        <>
                            Are you sure you want to delete{" "}
                            <strong style={{ color: "var(--text-primary, #0f172a)" }}>
                                "{itemName}"
                            </strong>
                            ?
                            <br />
                            This action cannot be undone.
                        </>
                    )}
                </p>

                {/* Actions */}
                <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        style={{
                            flex: 1,
                            padding: "10px 16px",
                            borderRadius: "8px",
                            border: "1px solid var(--border-color, #cbd5e1)",
                            background: "transparent",
                            color: "var(--text-primary, #334155)",
                            fontSize: "0.9rem",
                            fontWeight: "600",
                            cursor: loading ? "not-allowed" : "pointer",
                            opacity: loading ? 0.6 : 1,
                            transition: "all 0.2s ease",
                        }}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        style={{
                            flex: 1,
                            padding: "10px 16px",
                            borderRadius: "8px",
                            border: "none",
                            background: "#dc2626",
                            color: "#ffffff",
                            fontSize: "0.9rem",
                            fontWeight: "600",
                            cursor: loading ? "not-allowed" : "pointer",
                            opacity: loading ? 0.7 : 1,
                            boxShadow: "0 4px 6px -1px rgba(220, 38, 38, 0.3)",
                            transition: "all 0.2s ease",
                        }}
                    >
                        {loading ? "Deleting..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
