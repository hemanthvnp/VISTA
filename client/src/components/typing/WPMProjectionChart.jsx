/** @fileoverview WPM trend chart with polynomial projection line */
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function WPMProjectionChart({ sessions = [], projection = null }) {
  const data = sessions.map((s, i) => ({
    session: i + 1,
    wpm: s.wpm,
  }));

  // Add projection points if available
  if (projection) {
    const last = data.length;
    if (projection.predicted_30) data.push({ session: last + 10, projected: projection.predicted_30 });
    if (projection.predicted_60) data.push({ session: last + 30, projected: projection.predicted_60 });
    if (projection.predicted_90) data.push({ session: last + 60, projected: projection.predicted_90 });
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.2} />
          <XAxis dataKey="session" stroke="var(--color-chart-axis)" fontSize={12} />
          <YAxis stroke="var(--color-chart-axis)" fontSize={12} />
          <Tooltip
            contentStyle={{ backgroundColor: 'var(--bg-card)', border: '2px solid var(--color-border)', borderRadius: 8 }}
            labelStyle={{ color: 'var(--color-chart-axis)' }}
          />
          <ReferenceLine y={60} stroke="#FFBE0B" strokeDasharray="5 5" label={{ value: '60 WPM Goal', fill: '#FFBE0B', fontSize: 10 }} />
          <Line type="monotone" dataKey="wpm" stroke="#88D8B0" strokeWidth={2} dot={{ fill: '#88D8B0', r: 3 }} name="WPM" />
          <Line type="monotone" dataKey="projected" stroke="#8338EC" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#8338EC', r: 3 }} name="Projected" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
