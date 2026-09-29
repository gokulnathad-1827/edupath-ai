import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  Legend,
} from 'recharts';
import './CareerChart.css';

// Custom Tooltip for BarChart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{label}</p>
        <p className="chart-tooltip-value">{payload[0].value}% Match</p>
      </div>
    );
  }
  return null;
};

const COLORS = ['#6c63ff', '#00d4b1', '#a855f7', '#ff9f43', '#ff6b6b'];

/**
 * CareerChart — renders either a Bar or Radar chart for career match data.
 *
 * Props:
 *  data    — array of { career, matchPercentage }
 *  type    — 'bar' | 'radar'  (default: 'bar')
 */
const CareerChart = ({ data = [], type = 'bar' }) => {
  const chartData = data.map((d) => ({
    name: d.career,
    match: d.matchPercentage,
  }));

  return (
    <div className="career-chart">
      <ResponsiveContainer width="100%" height={300}>
        {type === 'radar' ? (
          <RadarChart data={chartData}>
            <PolarGrid stroke="rgba(108,99,255,0.15)" />
            <PolarAngleAxis
              dataKey="name"
              tick={{ fill: '#a0a0c0', fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: '#6060a0', fontSize: 10 }}
            />
            <Radar
              name="Match %"
              dataKey="match"
              stroke="#6c63ff"
              fill="#6c63ff"
              fillOpacity={0.3}
            />
            <Legend
              wrapperStyle={{ color: '#a0a0c0', fontSize: 12 }}
            />
          </RadarChart>
        ) : (
          <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
            <CartesianGrid stroke="rgba(108,99,255,0.08)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#a0a0c0', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              interval={0}
              angle={-15}
              textAnchor="end"
            />
            <YAxis
              tick={{ fill: '#6060a0', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(108,99,255,0.06)' }} />
            <Bar dataKey="match" radius={[6, 6, 0, 0]} maxBarSize={60}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default CareerChart;