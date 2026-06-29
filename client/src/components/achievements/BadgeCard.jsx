import { Lock, Unlock } from 'lucide-react';

/** Individual achievement badge card */
export default function BadgeCard({ badge, onClick }) {
  const categoryColors = {
    typing: 'border-brutal-mint/30 text-brutal-mint',
    learning: 'border-brutal-blue/30 text-brutal-blue',
    codec: 'border-brutal-yellow/30 text-brutal-yellow',
  };

  const colorClass = categoryColors[badge.category] || categoryColors.typing;

  return (
    <div
      onClick={() => onClick?.(badge)}
      className={`brutal-card p-4 cursor-pointer transition-all ${
        badge.unlocked
          ? `${colorClass} shadow-lg`
          : 'opacity-40 grayscale'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{badge.emoji || (badge.unlocked ? '🏆' : '🔒')}</span>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-text-primary">{badge.name}</h4>
          <span className={`text-xs ${colorClass.split(' ')[1]}`}>{badge.category}</span>
        </div>
        {badge.unlocked ? (
          <Unlock size={14} className="text-brutal-mint" />
        ) : (
          <Lock size={14} className="text-text-muted" />
        )}
      </div>
      <p className="text-xs text-text-muted">{badge.description}</p>
      {badge.unlocked && badge.unlockedAt && (
        <p className="text-xs text-text-muted mt-1">
          Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
        </p>
      )}
      {badge.xpBonus && (
        <span className="text-xs text-brutal-yellow">+{badge.xpBonus} XP bonus</span>
      )}
    </div>
  );
}
