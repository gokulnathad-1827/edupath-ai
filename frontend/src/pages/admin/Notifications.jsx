import React, { useState, useEffect } from "react";
import { RiTimeLine, RiCheckboxCircleLine, RiErrorWarningLine } from "react-icons/ri";
import { notificationApi } from "../../services/notificationApi";
import useAuth from "../hooks/useAuth";

const Notifications = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alertMsg, setAlertMsg] = useState({ text: "", type: "" });
    const [newNotif, setNewNotif] = useState({
        text: "",
        type: "info"
    });

    useEffect(() => {
        fetchNotifications();
    }, [user]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const adminUserId = user?.id || 1;
            const data = await notificationApi.getNotificationsForUser(adminUserId, "ADMIN");
            if (Array.isArray(data)) {
                setNotifications(data);
            }
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
            triggerAlert("Failed to load notifications from server.", "error");
        } finally {
            setLoading(false);
        }
    };

    const triggerAlert = (text, type = "success") => {
        setAlertMsg({ text, type });
        setTimeout(() => setAlertMsg({ text: "", type: "" }), 3000);
    };

    const handleSendNotif = async (e) => {
        e.preventDefault();
        if (!newNotif.text.trim()) {
            triggerAlert("Please enter a notification message.", "error");
            return;
        }

        try {
            const payload = {
                text: newNotif.text.trim(),
                message: newNotif.text.trim(),
                type: newNotif.type,
                targetRole: "ADMIN",
                userId: user?.id || 1,
                icon: newNotif.type === "success" ? "👤" : newNotif.type === "warning" ? "⚠️" : "📅"
            };

            const createdNotif = await notificationApi.createNotification(payload);
            setNotifications(prev => [createdNotif, ...prev]);
            triggerAlert("Notification sent successfully.", "success");
            setNewNotif({
                text: "",
                type: "info"
            });
        } catch (err) {
            console.error("Failed to create notification:", err);
            triggerAlert("Failed to send notification to server.", "error");
        }
    };

    return (
        <div className="dashboard animate-fade-in">
            <div className="dash-welcome">
                <div className="dash-welcome-text">
                    <h1>Administrative Notifications 🔔</h1>
                    <p>Alerts, notices, and log events for the academic portal.</p>
                </div>
            </div>

            <div className="dash-tasks-card">
                <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%" }}>
                    {alertMsg.text && (
                        <div className={`form-notification form-notification-${alertMsg.type}`}>
                            <span className="form-notification-icon">
                                {alertMsg.type === "error" ? <RiErrorWarningLine /> : <RiCheckboxCircleLine />}
                            </span>
                            <span className="form-notification-content">
                                {alertMsg.text}
                            </span>
                        </div>
                    )}

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "30px", width: "100%" }}>
                        {/* Left: Send Notification Form */}
                        <form onSubmit={handleSendNotif} style={{ display: "flex", flexDirection: "column", gap: "12px", width: "300px", flexShrink: 0 }}>
                            <h3 style={{ color: "var(--text-primary)", fontSize: "1.1rem", marginBottom: "4px" }}>Send Notification</h3>
                            
                            <div className="form-group">
                                <label className="form-label" style={{ marginBottom: "4px" }}>Notification Message</label>
                                <textarea 
                                    className="form-input" 
                                    placeholder="Enter notification text..."
                                    rows="4" 
                                    value={newNotif.text} 
                                    onChange={(e) => setNewNotif({ ...newNotif, text: e.target.value })}
                                    required
                                    style={{ resize: 'vertical', fontFamily: 'inherit' }}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ marginBottom: "4px" }}>Notification Type</label>
                                <select 
                                    className="form-input form-select"
                                    value={newNotif.type}
                                    onChange={(e) => setNewNotif({ ...newNotif, type: e.target.value })}
                                >
                                    <option value="info">Info (📅)</option>
                                    <option value="success">Success (👤)</option>
                                    <option value="warning">Warning (⚠️)</option>
                                </select>
                            </div>

                            <button 
                                type="submit"
                                style={{ 
                                    padding: "10px 16px", 
                                    borderRadius: "8px", 
                                    border: "none", 
                                    background: "#75070C", 
                                    color: "#fff", 
                                    cursor: "pointer",
                                    fontWeight: "600",
                                    marginTop: "12px"
                                }}
                            >
                                Send Notification
                            </button>
                        </form>

                        {/* Right: Notifications Feed */}
                        <div style={{ flex: 1, minWidth: "300px" }}>
                            <h3 style={{ color: "var(--text-primary)", fontSize: "1.1rem", marginBottom: "16px" }}>Notification Feed</h3>
                            <div className="dash-notif-list">
                                {loading ? (
                                    <div style={{ padding: "20px", color: "var(--text-secondary)", textAlign: "center" }}>Loading notifications...</div>
                                ) : notifications.length === 0 ? (
                                    <div style={{ padding: "20px", color: "var(--text-secondary)", textAlign: "center" }}>No notifications found.</div>
                                ) : (
                                    notifications.map((n) => (
                                        <div key={n.id} className={`dash-notif-item dash-notif-${n.type}`}>
                                            <span className="dash-notif-icon">{n.icon || "📅"}</span>
                                            <div className="dash-notif-content">
                                                <p>{n.text || n.message || n.title}</p>
                                                <span className="dash-notif-time"><RiTimeLine /> {n.time || "Just now"}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;