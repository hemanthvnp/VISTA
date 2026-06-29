/** @fileoverview Keyboard heatmap visualization using per-key performance data */
import { KEYBOARD_LAYOUT, getColorForKey } from '../../utils/fingerMap';

function getHeatColor(errorRate) {
  if (errorRate <= 0.02) return '#22c55e'; // green
  if (errorRate <= 0.05) return '#FFBE0B'; // yellow
  if (errorRate <= 0.10) return '#FB5607'; // orange
  return '#FF006E'; // pink
}

const KEY_WIDTHS = {
  Backspace: 90, Tab: 70, Caps: 80, Enter: 90, Shift: 110, Space: 340,
};

export default function KeyboardHeatmap({ keyStats = {} }) {
  const defaultWidth = 44;
  const keyHeight = 40;
  const gap = 4;
  const rowOffsets = [0, 10, 15, 25, 100];

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 700 260" className="w-full max-w-2xl mx-auto">
        {KEYBOARD_LAYOUT.map(({ row, keys }) => {
          let x = rowOffsets[row] || 0;
          return keys.map((key) => {
            const w = KEY_WIDTHS[key] || defaultWidth;
            const stats = keyStats[key.toLowerCase()] || {};
            const errorRate = stats.errorRate || 0;
            const fill = Object.keys(keyStats).length > 0 ? getHeatColor(errorRate) : getColorForKey(key);
            const rect = (
              <g key={`${row}-${key}-${x}`}>
                <rect
                  x={x}
                  y={row * (keyHeight + gap) + 10}
                  width={w - 2}
                  height={keyHeight - 2}
                  rx={6}
                  fill={fill}
                  fillOpacity={0.2}
                  stroke="var(--color-border)"
                  strokeOpacity={0.3}
                  strokeWidth={1.5}
                />
                <text
                  x={x + (w - 2) / 2}
                  y={row * (keyHeight + gap) + 10 + (keyHeight - 2) / 2 + 4}
                  textAnchor="middle"
                  fill="var(--text-primary)"
                  fontSize={key.length > 1 ? 9 : 13}
                  fontFamily="JetBrains Mono, monospace"
                >
                  {key.length > 5 ? key.slice(0, 3) : key}
                </text>
              </g>
            );
            x += w + gap;
            return rect;
          });
        })}
      </svg>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-3 text-xs">
        {[
          { color: '#22c55e', label: '< 2% errors' },
          { color: '#FFBE0B', label: '2-5% errors' },
          { color: '#FB5607', label: '5-10% errors' },
          { color: '#FF006E', label: '> 10% errors' },
        ].map(({ color, label }) => (
          <div key={color} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: color, opacity: 0.5 }} />
            <span className="text-text-muted">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
