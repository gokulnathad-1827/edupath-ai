import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import {
  RiPercentLine,
  RiAlertLine,
  RiBookOpenLine,
  RiFileChartLine,
} from 'react-icons/ri';
import Card from '../../components/common/Card';
import useAuth from '../hooks/useAuth';
import { edupathApi } from '../../services/edupathApi';

const Reports = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState({
    classSize: 0,
    averageAttendance: '0.0%',
    averageGrade: '0.0%',
    atRisk: 0,
    gradeDistribution: [],
    trendData: [],
    assignedStudents: [],
  });

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        let teacher = null;
        if (user?.email) {
          teacher = await edupathApi.getTeacherByEmail(user.email).catch(() => null);
        }
        if (!teacher && user?.id) {
          teacher = await edupathApi.getTeacherByUserId(user.id).catch(() => null);
        }
        if (!teacher) {
          const allTeachers = await edupathApi.getAllTeachers().catch(() => []);
          if (Array.isArray(allTeachers) && allTeachers.length > 0) {
            teacher = allTeachers[0];
          }
        }

        if (teacher?.id) {
          const res = await edupathApi.getTeacherReport(teacher.id);
          if (res) {
            setReport(res);
          }
        }
      } catch (err) {
        console.error('[Teacher Reports Fetch Error]', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [user]);

  const summary = {
    classSize: report.classSize != null ? report.classSize : 0,
    averageAttendance: report.averageAttendance || '0.0%',
    averageGrade: report.averageGrade || '0.0%',
    atRisk: report.atRisk != null ? report.atRisk : 0,
  };

  const gradeData = report.gradeDistribution || [];
  const trendData = report.trendData || [];

  return (
    <div className="dashboard animate-fade-in">
      {/* Welcome Header */}
      <div className="dash-welcome">
        <div className="dash-welcome-text">
          <h1>Academic Reports 📊</h1>
          <p>View class performance, attendance summary, and risk assessments.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="dash-stats">
        <Card
          icon={<RiBookOpenLine />}
          title="Class Size"
          value={summary.classSize}
          badge="Students"
          badgeType="primary"
          hoverable
        />
        <Card
          icon={<RiPercentLine />}
          title="Average Attendance"
          value={summary.averageAttendance}
          badge="Stable"
          badgeType="success"
          hoverable
        />
        <Card
          icon={<RiFileChartLine />}
          title="Average Grade"
          value={summary.averageGrade}
          badge="Good"
          badgeType="success"
          hoverable
        />
        <Card
          icon={<RiAlertLine />}
          title="At-Risk Students"
          value={summary.atRisk}
          badge="Immediate Action"
          badgeType="danger"
          hoverable
        />
      </div>

      {/* Two Column Chart Section */}
      <div className="dash-two-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginTop: '20px' }}>
        
        {/* Grade Distribution Chart */}
        <div className="dash-tasks-card">
          <div className="dash-section-title">
            <h3>Grade Distribution</h3>
          </div>
          <div style={{ width: '100%', height: '300px', marginTop: '10px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle, rgba(0,0,0,0.06))" />
                <XAxis dataKey="grade" stroke="var(--text-muted, #888)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-muted, #888)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--bg-card, #fff)', 
                    border: '1.5px solid var(--border-card, #ccc)',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-md)'
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {gradeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Academic Trends Chart */}
        <div className="dash-tasks-card">
          <div className="dash-section-title">
            <h3>Performance & Attendance Trends</h3>
          </div>
          <div style={{ width: '100%', height: '300px', marginTop: '10px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle, rgba(0,0,0,0.06))" />
                <XAxis dataKey="month" stroke="var(--text-muted, #888)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-muted, #888)" fontSize={12} tickLine={false} axisLine={false} unit="%" />
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--bg-card, #fff)', 
                    border: '1.5px solid var(--border-card, #ccc)',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-md)'
                  }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Line type="monotone" dataKey="Average Grade" stroke="#75070C" strokeWidth={3} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Class Attendance" stroke="#D4AF37" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Reports;