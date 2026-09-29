import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import useAuth from '../hooks/useAuth';
import '../../layouts/StudentLayout.css';

function TeacherLayout() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="student-layout">
      <Navbar onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      <Sidebar role="teacher" isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className={`student-main ${sidebarOpen ? 'main-shifted' : ''}`}>
        <main className="student-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default TeacherLayout;
