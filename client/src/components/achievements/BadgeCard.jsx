import { Lock } from 'lucide-react';

const CATEGORY_STYLES = {
  learner:  { border: 'border-brutal-mint',   glow: 'shadow-[0_0_12px_rgba(16,185,129,0.35)]',  label: 'text-brutal-mint',   dot: 'bg-brutal-mint'   },
  builder:  { border: 'border-brutal-blue',   glow: 'shadow-[0_0_12px_rgba(59,130,246,0.35)]',  label: 'text-brutal-blue',   dot: 'bg-brutal-blue'   },
  grind:    { border: 'border-brutal-coral',  glow: 'shadow-[0_0_12px_rgba(239,68,68,0.35)]',   label: 'text-brutal-coral',  dot: 'bg-brutal-coral'  },
  explorer: { border: 'border-brutal-yellow', glow: 'shadow-[0_0_12px_rgba(234,179,8,0.35)]',   label: 'text-brutal-yellow', dot: 'bg-brutal-yellow' },
  vista:    { border: 'border-brutal-purple', glow: 'shadow-[0_0_16px_rgba(131,56,236,0.45)]',  label: 'text-brutal-purple', dot: 'bg-brutal-purple' },
};

export default function BadgeCard({ badge, isNew, onClick }) {
  const style = CATEGORY_STYLES[badge.category] || CATEGORY_STYLES.learner;

  return (
    <button
      onClick={() => onClick?.(badge)}
      className={`
        relative w-full text-left rounded-xl border-2 p-4 transition-all duration-200
        ${badge.unlocked
          ? `${style.border} ${style.glow} bg-bg-card hover:scale-[1.02] cursor-pointer`
          : 'border-brutal-black bg-bg-elevated opacity-50 grayscale cursor-pointer hover:opacity-70'
        }
      `}
    >
      {/* NEW pill */}
      {isNew && (
        <span className="absolute -top-2 -right-2 bg-brutal-coral text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20 z-10">
          NEW
        </span>
      )}

      {/* Lock overlay */}
      {!badge.unlocked && (
        <div className="absolute top-3 right-3">
          <Lock size={13} className="text-text-muted" />
        </div>
      )}

      {/* Emoji */}
      <div className="text-3xl mb-2 leading-none">{badge.emoji}</div>

      {/* Name */}
      <p className="text-sm font-bold text-text-primary leading-tight mb-1">{badge.name}</p>

      {/* Description */}
      <p className="text-xs text-text-muted leading-snug">{badge.description}</p>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between">
        {badge.xpBonus ? (
          <span className={`text-[10px] font-bold ${style.label}`}>+{badge.xpBonus} XP</span>
        ) : <span />}
        {badge.unlocked && badge.unlockedAt && (
          <span className="text-[10px] text-text-muted">
            {new Date(badge.unlockedAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </button>
  );
}
