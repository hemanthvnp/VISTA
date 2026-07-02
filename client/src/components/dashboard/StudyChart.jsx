import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-card border-2 border-brutal-black rounded-lg px-3 py-2 shadow-brutal-sm text-xs">
      <p className="text-text-muted font-mono mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.stroke }} className="font-semibold">
          {p.name === 'typing' ? 'Typing' : 'Lessons'}: {p.value}m
        </p>
      ))}
    </div>
  );
}

export default function StudyChart({ data = [] }) {
  const chartData = data.length > 0 ? data : Array.from({ length: 14 }, (_, i) => ({
    day: `D${i + 1}`, typing: 0, learning: 0,
  }));

  const hasData = chartData.some(d => d.typing > 0 || d.learning > 0);

  return (
    <div className="relative">
      {!hasData && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <p className="text-xs text-text-muted">No sessions yet — start practicing to see your chart</p>
        </div>
      )}
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradTyping" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#88D8B0" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#88D8B0" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradLearn" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8338EC" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#8338EC" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.4} vertical={false} />
          <XAxis dataKey="day" stroke="var(--color-chart-axis)" fontSize={9} tickLine={false} axisLine={false} interval={1} />
          <YAxis stroke="var(--color-chart-axis)" fontSize={9} tickLine={false} axisLine={false} unit="m" />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="typing" stroke="#88D8B0" fill="url(#gradTyping)" strokeWidth={2} dot={false} name="typing" />
          <Area type="monotone" dataKey="learning" stroke="#8338EC" fill="url(#gradLearn)" strokeWidth={2} dot={false} name="learning" />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-2">
        <span className="flex items-center gap-1.5 text-[10px] text-text-muted">
          <span className="w-3 h-0.5 bg-brutal-mint inline-block rounded" /> Typing
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-text-muted">
          <span className="w-3 h-0.5 bg-brutal-purple inline-block rounded" /> Lessons
        </span>
      </div>
    </div>
  );
}
