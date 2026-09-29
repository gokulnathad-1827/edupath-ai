import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { edupathApi } from '../../services/edupathApi';

const PerformanceChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        setLoading(true);
        const res = await edupathApi.getAdminPerformanceAverage().catch(() => null);
        if (res && res.hasPerformanceData && Array.isArray(res.performanceData)) {
          const mapped = res.performanceData.map(item => ({
            subject: item.month,
            'Average Score': item.average,
          }));
          setChartData(mapped);
        } else {
          setChartData([]);
        }
      } catch (err) {
        console.error('[Admin PerformanceChart Error]', err);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformance();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading subject performance analytics...
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        No academic marks data available in database to calculate subject performance.
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '400px', padding: '10px 0' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#75070C" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#75070C" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle, rgba(0,0,0,0.06))" />
          <XAxis 
            dataKey="subject" 
            stroke="var(--text-muted, #888)" 
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="var(--text-muted, #888)" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            unit="%"
          />
          <Tooltip 
            contentStyle={{ 
              background: 'var(--bg-card, #fff)', 
              border: '1.5px solid var(--border-card, #ccc)',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-md)'
            }}
          />
          <Legend verticalAlign="top" height={36} iconType="circle" />
          <Area 
            type="monotone" 
            dataKey="Average Score" 
            stroke="#75070C" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorScore)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;