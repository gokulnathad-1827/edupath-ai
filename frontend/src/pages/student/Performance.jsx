import React, { useState, useEffect } from 'react';
import { RiBarChartBoxLine } from 'react-icons/ri';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { edupathApi } from '../../services/edupathApi';
import useAuth from '../hooks/useAuth';
import './StudentPage.css';

const getGradeColor = (g) => {
  if (['A+', 'A'].includes(g)) return 'status-high';
  if (g.startsWith('B')) return 'status-medium';
  return 'status-low';
};

const COLORS = ['#6c63ff', '#00d4b1', '#a855f7', '#ff9f43', '#26e5c7', '#ff6b6b'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="dash-tooltip">
        <p>{label}</p>
        <p><strong style={{ color: 'var(--primary-light)' }}>{payload[0].value}</strong> / 100</p>
      </div>
    );
  }
  return null;
};

const Performance = () => {
  const { user } = useAuth();
  const [subjectsData, setSubjectsData] = useState([]);
  const [overallData, setOverallData] = useState(null);
  const [rankData, setRankData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealMarks = async () => {
      try {
        setLoading(true);
        let student = null;
        if (user?.email) {
          student = await edupathApi.getStudentByEmail(user.email).catch(() => null);
        }
        if (!student && user?.id) {
          student = await edupathApi.getStudentByUserId(user.id).catch(() => null);
        }
        if (!student) {
          const allStuds = await edupathApi.getAllStudents().catch(() => []);
          if (Array.isArray(allStuds) && allStuds.length > 0) {
            student = allStuds[0];
          }
        }

        if (student?.id) {
          const [marksList, overallRes, rankRes] = await Promise.all([
            edupathApi.getStudentMarks(student.id).catch(() => []),
            edupathApi.getStudentOverallPercentage(student.id).catch(() => null),
            edupathApi.getStudentClassRank(student.id).catch(() => null),
          ]);

          if (Array.isArray(marksList)) {
            const mapped = marksList.map((m) => {
              const numMarks = parseFloat(m.marks) || 0;
              let grade = 'F';
              if (numMarks >= 90) grade = 'A+';
              else if (numMarks >= 80) grade = 'A';
              else if (numMarks >= 70) grade = 'B+';
              else if (numMarks >= 60) grade = 'B';
              else if (numMarks >= 50) grade = 'C';
              else grade = 'D';

              return {
                subject: m.subject || 'General',
                marks: numMarks,
                maxMarks: 100,
                grade,
              };
            });
            setSubjectsData(mapped);
          }

          if (overallRes) setOverallData(overallRes);
          if (rankRes) setRankData(rankRes);
        }
      } catch (err) {
        console.error('[Student Performance Marks Fetch Error]', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRealMarks();
  }, [user]);

  const avg = overallData?.overallPercentage ?? (subjectsData.length > 0
    ? Math.round(subjectsData.reduce((s, r) => s + r.marks, 0) / subjectsData.length)
    : 0);

  const overallGrade = overallData?.grade ?? (avg >= 90 ? 'A+' : avg >= 80 ? 'A' : avg >= 70 ? 'B+' : avg >= 60 ? 'B' : 'C');
  const classRankDisplay = rankData?.hasRankData && rankData?.classRank ? `#${rankData.classRank}` : 'N/A';

  return (
    <div className="student-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-icon" style={{ background: 'var(--gradient-primary)' }}>
          <RiBarChartBoxLine />
        </div>
        <div>
          <h2 className="page-title">Academic Performance</h2>
          <p className="page-subtitle">Subject-wise marks, grades, and your academic standing from MySQL database.</p>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="perf-kpi-strip">
        <div className="perf-kpi">
          <span className="perf-kpi-value">{loading ? '...' : `${avg}%`}</span>
          <span className="perf-kpi-label">Overall Percentage</span>
        </div>
        <div className="perf-kpi">
          <span className="perf-kpi-value">{loading ? '...' : overallGrade}</span>
          <span className="perf-kpi-label">Overall Grade</span>
        </div>
        <div className="perf-kpi">
          <span className="perf-kpi-value">{loading ? '...' : classRankDisplay}</span>
          <span className="perf-kpi-label">Class Rank</span>
        </div>
        <div className="perf-kpi">
          <span className="perf-kpi-value">{loading ? '...' : subjectsData.filter(s => ['A+','A'].includes(s.grade)).length}</span>
          <span className="perf-kpi-label">A/A+ Subjects</span>
        </div>
      </div>

      {/* Chart */}
      <div className="page-card">
        <h4 className="profile-section-title">Subject-wise Marks Chart</h4>
        {loading ? (
          <p style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading performance chart...</p>
        ) : subjectsData.length === 0 ? (
          <p style={{ padding: '20px', color: 'var(--text-secondary)' }}>No subject marks recorded in database for chart visualization.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={subjectsData} margin={{ top: 10, right: 10, bottom: 40, left: -10 }}>
              <CartesianGrid stroke="rgba(108,99,255,0.07)" vertical={false} />
              <XAxis
                dataKey="subject"
                tick={{ fill: '#a0a0c0', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                angle={-15}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={{ fill: '#6060a0', fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(108,99,255,0.05)' }} />
              <Bar dataKey="marks" radius={[6, 6, 0, 0]} maxBarSize={50}>
                {subjectsData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Table */}
      <div className="page-card">
        <h4 className="profile-section-title">Detailed Score Sheet</h4>
        {loading ? (
          <p style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading score sheet from database...</p>
        ) : subjectsData.length === 0 ? (
          <p style={{ padding: '20px', color: 'var(--text-secondary)' }}>No academic marks available in database.</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Subject</th>
                  <th>Marks</th>
                  <th>Max</th>
                  <th>Percentage</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {subjectsData.map((row, i) => (
                  <tr key={row.subject + i}>
                    <td>{i + 1}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{row.subject}</td>
                    <td style={{ fontWeight: 600, color: 'var(--primary-light)' }}>{row.marks}</td>
                    <td>{row.maxMarks}</td>
                    <td>
                      <div className="att-cell">
                        <span className={`att-pct-text ${getGradeColor(row.grade)}`}>{Math.round((row.marks / row.maxMarks) * 100)}%</span>
                        <div className="att-mini-bar">
                          <div
                            className={`att-mini-fill ${getGradeColor(row.grade)}`}
                            style={{ width: `${Math.min(row.marks, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`att-status ${getGradeColor(row.grade)}`}>{row.grade}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Performance;