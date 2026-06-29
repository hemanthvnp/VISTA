/** @fileoverview Animated progress bar with label and percentage display */

const colorMap = {
  cyan: 'bg-brutal-mint',
  purple: 'bg-brutal-purple',
  gold: 'bg-brutal-yellow',
  blue: 'bg-brutal-blue',
  green: 'bg-success',
  orange: 'bg-brutal-orange',
  magenta: 'bg-brutal-pink',
};

export default function ProgressBar({ value = 0, label, showPercent = true, color = 'cyan', className = '', height = 'h-2' }) {
  const pct = Math.min(100, Math.max(0, value));

  return (
    <div className={className}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-sm text-text-secondary font-body">{label}</span>}
          {showPercent && <span className="text-sm text-text-primary font-mono">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className={`w-full ${height} bg-bg-elevated border border-brutal-black rounded-sm overflow-hidden`}>
        <div
          className={`${height} rounded-sm ${colorMap[color] || colorMap.cyan} transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
