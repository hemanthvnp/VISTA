/** @fileoverview Streak flame badge with tier-based colors */
import { Flame } from 'lucide-react';

const TIERS = {
  bronze: { color: 'text-warning-text', label: 'Bronze' },
  silver: { color: 'text-text-muted', label: 'Silver' },
  gold: { color: 'text-brutal-yellow', label: 'Gold' },
  diamond: { color: 'text-brutal-mint', label: 'Diamond' },
};

function getStreakTier(count) {
  if (count >= 30) return 'diamond';
  if (count >= 14) return 'gold';
  if (count >= 7) return 'silver';
  if (count >= 1) return 'bronze';
  return null;
}

export default function StreakBadge({ count = 0, type = '', compact = false }) {
  const tier = getStreakTier(count);

  if (!tier) {
    return (
      <div className="flex items-center gap-1.5 text-text-muted">
        <Flame size={compact ? 16 : 20} />
        <span className="font-mono text-sm">0</span>
      </div>
    );
  }

  const { color, label } = TIERS[tier];

  return (
    <div className={`flex items-center gap-1.5 ${color}`}>
      <Flame
        size={compact ? 16 : 22}
        fill="currentColor"
      />
      <span className="font-mono text-sm font-bold">{count}</span>
      {!compact && (
        <span className="text-xs text-text-muted ml-1">{label} streak</span>
      )}
    </div>
  );
}
