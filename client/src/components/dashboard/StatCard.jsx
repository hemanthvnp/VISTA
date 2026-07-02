import { TrendingUp } from 'lucide-react';

const COLOR = {
  cyan:    { val: 'text-brutal-mint',   icon: 'text-brutal-mint',   bar: 'bg-brutal-mint',   ring: 'bg-brutal-mint/10'   },
  purple:  { val: 'text-brutal-purple', icon: 'text-brutal-purple', bar: 'bg-brutal-purple', ring: 'bg-brutal-purple/10' },
  gold:    { val: 'text-brutal-yellow', icon: 'text-brutal-yellow', bar: 'bg-brutal-yellow', ring: 'bg-brutal-yellow/10' },
  orange:  { val: 'text-brutal-coral',  icon: 'text-brutal-coral',  bar: 'bg-brutal-coral',  ring: 'bg-brutal-coral/10'  },
  magenta: { val: 'text-brutal-pink',   icon: 'text-brutal-pink',   bar: 'bg-brutal-pink',   ring: 'bg-brutal-pink/10'   },
};

export default function StatCard({ label, value, icon: Icon = TrendingUp, color = 'cyan', subtitle, pct }) {
  const c = COLOR[color] || COLOR.cyan;

  return (
    <div className="brutal-card p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-muted font-medium">{label}</span>
        <div className={`p-1.5 rounded-lg ${c.ring}`}>
          <Icon size={15} className={c.icon} />
        </div>
      </div>

      <div className={`text-2xl font-bold font-mono ${c.val} leading-none`}>{value}</div>

      {pct !== undefined && (
        <div className="h-1 bg-bg-elevated rounded-full overflow-hidden">
          <div className={`h-full ${c.bar} rounded-full transition-all duration-700`} style={{ width: `${Math.min(pct, 100)}%` }} />
        </div>
      )}

      {subtitle && <span className="text-[11px] text-text-muted leading-none">{subtitle}</span>}
    </div>
  );
}
