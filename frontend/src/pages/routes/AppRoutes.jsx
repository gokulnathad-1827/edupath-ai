import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Layouts
import StudentLayout from "../layouts/StudentLayout";
import AdminLayout from "../layouts/AdminLayout";
import CounselorLayout from "../layouts/CounselorLayout";
import TeacherLayout from "../layouts/TeacherLayout";
import ParentLayout from "../layouts/ParentLayout";

// Landing & Auth Pages
import Home from "../landing/Home";
import Login from "../auth/Login";
import PortalSelection from "../auth/PortalSelection";
import RoleLogin from "../auth/RoleLogin";
import Register from "../auth/Register";
import ForgotPassword from "../auth/ForgotPassword";
import ResetPassword from "../auth/ResetPassword";

// Student Pages
import StudentDashboard from "../student/Dashboard";
import Profile from "../student/Profile";
import Attendance from "../student/Attendance";
import Performance from "../student/Performance";
import CareerAssessment from "../student/CareerAssessment";
import CareerRecommendation from "../student/CareerRecommendation";
import Notifications from "../student/Notifications";

// Admin Pages
import AdminDashboard from "../admin/Dashboard";
import AdminAnalytics from "../admin/Analytics";
import AdminClasses from "../admin/Classes";
import AdminNotifications from "../admin/Notifications";
import AdminReports from "../admin/Reports";
import AdminStudents from "../admin/Students";
import AdminTeacher from "../admin/Teacher";

// Counselor Pages
import CounselorDashboard from "../counselor/Dashboard";
import CounselorAtRisk from "../counselor/AtRiskStudents";
import CounselorReports from "../counselor/Reports";
import CounselorSessions from "../counselor/Sessions";
import CounselorProfile from "../counselor/Profile";

// Teacher Pages
import TeacherDashboard from "../teacher/Dashboard";
import TeacherAttendance from "../teacher/Attendance";
import TeacherMarks from "../teacher/Marks";
import TeacherReports from "../teacher/Reports";
import TeacherStudents from "../teacher/Students";
import TeacherProfile from "../teacher/Profile";

// Parent Pages
import ParentDashboard from "../parent/Dashboard";
import ParentChildProgress from "../parent/ChildProgress";
import ParentProfile from "../parent/Profile";

// Fallback/Error
import NotFound from "../error/NotFound";

function AppRoutes() {
    return (
        <Routes>
            {/* ── Public Routes ────────────────────────── */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/portals" element={<Navigate to="/login" replace />} />
            <Route path="/student/login" element={<Navigate to="/login" replace />} />
            <Route path="/teacher/login" element={<Navigate to="/login" replace />} />
            <Route path="/parent/login" element={<Navigate to="/login" replace />} />
            <Route path="/counselor/login" element={<Navigate to="/login" replace />} />
            <Route path="/admin/login" element={<Navigate to="/login" replace />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Base Path Redirects */}
            <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
            <Route path="/teacher" element={<Navigate to="/teacher/dashboard" replace />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/parent" element={<Navigate to="/parent/dashboard" replace />} />
            <Route path="/counselor" element={<Navigate to="/counselor/dashboard" replace />} />

            {/* ── Protected Portal Routes ──────────────── */}
            <Route element={<ProtectedRoute />}>
                
                {/* 1. Student Portal Routes */}
                <Route element={<StudentLayout />}>
                    <Route path="/student/dashboard" element={<StudentDashboard />} />
                    <Route path="/student/profile" element={<Profile />} />
                    <Route path="/student/attendance" element={<Attendance />} />
                    <Route path="/student/performance" element={<Performance />} />
                    
                    <Route path="/student/career-assessment" element={<CareerAssessment />} />
                    <Route path="/student/assessment" element={<CareerAssessment />} />
                    <Route path="/student/career-recommendation" element={<CareerRecommendation />} />
                    <Route path="/student/recommendation" element={<CareerRecommendation />} />
                    
                    <Route path="/student/notifications" element={<Notifications />} />
                </Route>

                {/* 2. Teacher Portal Routes */}
                <Route element={<TeacherLayout />}>
                    <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                    <Route path="/teacher/profile" element={<TeacherProfile />} />
                    <Route path="/teacher/students" element={<TeacherStudents />} />
                    <Route path="/teacher/attendance" element={<TeacherAttendance />} />
                    <Route path="/teacher/marks" element={<TeacherMarks />} />
                    <Route path="/teacher/reports" element={<TeacherReports />} />
                    <Route path="/teacher/notifications" element={<Notifications />} />
                </Route>

                {/* 3. Admin Portal Routes */}
                <Route element={<AdminLayout />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/students" element={<AdminStudents />} />
                    <Route path="/admin/teacher" element={<AdminTeacher />} />
                    <Route path="/admin/teachers" element={<AdminTeacher />} />
                    <Route path="/admin/classes" element={<AdminClasses />} />
                    <Route path="/admin/sessions" element={<CounselorSessions />} />
                    <Route path="/admin/analytics" element={<AdminAnalytics />} />
                    <Route path="/admin/reports" element={<AdminReports />} />
                    <Route path="/admin/notifications" element={<AdminNotifications />} />
                </Route>

                {/* 4. Parent Portal Routes */}
                <Route element={<ParentLayout />}>
                    <Route path="/parent/dashboard" element={<ParentDashboard />} />
                    <Route path="/parent/profile" element={<ParentProfile />} />
                    <Route path="/parent/child-progress" element={<ParentChildProgress />} />
                    
                    <Route path="/parent/attendance" element={<Attendance />} />
                    <Route path="/parent/performance" element={<Performance />} />
                    <Route path="/parent/notifications" element={<Notifications />} />
                </Route>

                {/* 5. Counselor Portal Routes */}
                <Route element={<CounselorLayout />}>
                    <Route path="/counselor/dashboard" element={<CounselorDashboard />} />
                    <Route path="/counselor/profile" element={<CounselorProfile />} />
                    <Route path="/counselor/at-risk" element={<CounselorAtRisk />} />
                    <Route path="/counselor/sessions" element={<CounselorSessions />} />
                    <Route path="/counselor/reports" element={<CounselorReports />} />
                    <Route path="/counselor/notifications" element={<Notifications />} />
                </Route>

            </Route>

            {/* ── Fallback Route ──────────────────────── */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default AppRoutes;