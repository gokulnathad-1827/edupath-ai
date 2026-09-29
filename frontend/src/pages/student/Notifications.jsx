import React, { useState, useEffect } from 'react';
import {
  RiNotification3Line,
  RiCalendarLine,
  RiAlertLine,
  RiCheckboxCircleLine,
  RiInformationLine,
  RiTimeLine,
} from 'react-icons/ri';
import notificationApi from '../../services/notificationApi';
import './StudentPage.css';

const CATEGORIES = ['All', 'Attendance', 'Career', 'Assignment', 'Exam', 'Performance', 'Notice'];
const TYPE_COLORS = { info: 'primary', success: 'success', warning: 'warning', danger: 'danger' };

const getIcon = (type) => {
  if (type === 'warning' || type === 'danger') return <RiAlertLine />;
  if (type === 'success') return <RiCheckboxCircleLine />;
  return <RiInformationLine />;
};

const Notifications = () => {
  const [filter, setFilter] = useState('All');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        const userId = user?.id || user?.userId;
        const role = user?.role;

        const data = userId 
          ? await notificationApi.getNotificationsForUser(userId, role)
          : await notificationApi.getAllNotifications();
        if (Array.isArray(data)) {
          const mapped = data.map((n) => ({
            id: n.id,
            type: (n.type || 'info').toLowerCase(),
            icon: getIcon((n.type || 'info').toLowerCase()),
            category: n.category || 'Notice',
            title: n.title || 'System Notification',
            body: n.text || n.message || '',
            date: n.date || (n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Recent'),
            status: n.isRead ? 'read' : 'unread',
          }));
          setNotifications(mapped);
        }
      } catch (err) {
        console.error('[Notifications Load Error]', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const displayed = filter === 'All'
    ? notifications
    : notifications.filter((n) => n.category.toLowerCase() === filter.toLowerCase());

  const markRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: 'read' } : n))
    );

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, status: 'read' })));

  const unreadCount = notifications.filter((n) => n.status === 'unread').length;

  return (
    <div className="student-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-icon" style={{ background: 'var(--gradient-primary)' }}>
          <RiNotification3Line />
        </div>
        <div style={{ flex: 1 }}>
          <h2 className="page-title">
            Notifications{' '}
            {unreadCount > 0 && (
              <span className="badge badge-danger" style={{ fontSize: '0.75rem', verticalAlign: 'middle' }}>
                {unreadCount} new
              </span>
            )}
          </h2>
          <p className="page-subtitle">Stay updated on assignments, attendance alerts, and AI insights.</p>
        </div>
        {unreadCount > 0 && (
          <button className="mark-all-btn" onClick={markAllRead}>Mark all read</button>
        )}
      </div>

      {/* Category Filter */}
      <div className="notif-filter-bar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`notif-filter-btn ${filter === cat ? 'filter-active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
            {cat === 'All' && (
              <span className="filter-count">{notifications.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Notification Cards */}
      <div className="notif-cards">
        {loading ? (
          <div className="notif-empty">
            <p>Loading notifications from database...</p>
          </div>
        ) : displayed.length === 0 ? (
          <div className="notif-empty">
            <span>🔔</span>
            <p>No notifications</p>
          </div>
        ) : (
          displayed.map((n) => (
            <div
              key={n.id}
              className={`notif-card notif-card-${n.type} ${n.status === 'unread' ? 'notif-unread' : ''}`}
              onClick={() => markRead(n.id)}
            >
              <div className={`notif-card-icon badge-${TYPE_COLORS[n.type] || 'primary'}`}>
                {n.icon}
              </div>
              <div className="notif-card-body">
                <div className="notif-card-header-row">
                  <span className={`badge badge-${TYPE_COLORS[n.type] || 'primary'}`}>{n.category}</span>
                  <span className="notif-card-date">
                    <RiTimeLine /> {n.date}
                  </span>
                </div>
                <h4 className="notif-card-title">{n.title}</h4>
                <p className="notif-card-text">{n.body}</p>
              </div>
              {n.status === 'unread' && <div className="notif-unread-dot" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;