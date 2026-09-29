// ===============================
// API Configuration
// ===============================

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api";

// ===============================
// User Roles
// ===============================

export const USER_ROLES = {
  ADMIN: "Admin",
  TEACHER: "Teacher",
  STUDENT: "Student",
  PARENT: "Parent",
  COUNSELOR: "Counselor",
};

// ===============================
// Theme Options
// ===============================

export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
};

// ===============================
// Risk Levels
// ===============================

export const RISK_LEVELS = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

// ===============================
// Attendance Status
// ===============================

export const ATTENDANCE_STATUS = {
  PRESENT: "Present",
  ABSENT: "Absent",
  LEAVE: "Leave",
};

// ===============================
// Notification Types
// ===============================

export const NOTIFICATION_TYPES = {
  INFO: "Info",
  SUCCESS: "Success",
  WARNING: "Warning",
  ERROR: "Error",
};

// ===============================
// Routes
// ===============================

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",

  PARENT_DASHBOARD: "/parent/dashboard",
  CHILD_PROGRESS: "/parent/child-progress",

  COUNSELOR_DASHBOARD: "/counselor/dashboard",
  COUNSELOR_SESSIONS: "/counselor/sessions",
  AT_RISK_STUDENTS: "/counselor/at-risk-students",
  COUNSELOR_REPORTS: "/counselor/reports",

  UNAUTHORIZED: "/unauthorized",
  NOT_FOUND: "*",
};