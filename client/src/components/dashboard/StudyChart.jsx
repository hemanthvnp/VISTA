import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

/** Study hours chart for dashboard - 14-day area chart */
export default function StudyChart({ data = [] }) {
  const chartData = data.length > 0 ? data : Array.from({ length: 14 }, (_, i) => ({
    day: `D${i + 1}`,
    typing: 0,
    learning: 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={chartData}>
        <XAxis dataKey="day" stroke="var(--color-chart-axis)" fontSize={10} tickLine={false} />
        <YAxis stroke="var(--color-chart-axis)" fontSize={10} tickLine={false} unit="m" />
        <Tooltip
          contentStyle={{ background: 'var(--bg-card)', border: '2px solid var(--color-border)', borderRadius: 8, color: 'var(--text-primary)' }}
          formatter={(v, name) => [`${v}m`, name === 'typing' ? 'Typing' : 'Lessons']}
        />
        <Area type="monotone" dataKey="typing" stroke="#88D8B0" fill="#88D8B0" fillOpacity={0.15} strokeWidth={2} name="Typing" />
        <Area type="monotone" dataKey="learning" stroke="#8338EC" fill="#8338EC" fillOpacity={0.15} strokeWidth={2} name="Lessons" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

