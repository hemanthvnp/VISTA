import { TrendingUp } from 'lucide-react';

/** Stat card for dashboard quick stats row */
export default function StatCard({ label, value, icon: Icon = TrendingUp, color = 'cyan', subtitle }) {
  const colorMap = {
    cyan: 'text-brutal-mint border-brutal-mint/30 shadow-brutal-md',
    purple: 'text-brutal-purple border-brutal-purple/30 shadow-brutal-md',
    gold: 'text-brutal-yellow border-brutal-yellow/30 shadow-brutal-md',
    orange: 'text-brutal-orange border-brutal-orange/30',
    magenta: 'text-brutal-pink border-brutal-pink/30 shadow-brutal-md',
  };

  return (
    <div className={`brutal-card p-4 flex flex-col gap-1 ${colorMap[color] || ''}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-muted">{label}</span>
        <Icon size={18} className={colorMap[color]?.split(' ')[0] || 'text-brutal-mint'} />
      </div>
      <div className={`text-2xl font-bold font-mono ${colorMap[color]?.split(' ')[0] || 'text-brutal-mint'}`}>
        {value}
      </div>
      {subtitle && <span className="text-xs text-text-muted">{subtitle}</span>}
    </div>
  );
}
