import BadgeCard from './BadgeCard';

const CATEGORY_META = {
  learner:  { label: 'Learner',      color: 'text-brutal-mint',   bar: 'bg-brutal-mint'   },
  builder:  { label: 'Builder',      color: 'text-brutal-blue',   bar: 'bg-brutal-blue'   },
  grind:    { label: 'Daily Grind',  color: 'text-brutal-coral',  bar: 'bg-brutal-coral'  },
  explorer: { label: 'Explorer',     color: 'text-brutal-yellow', bar: 'bg-brutal-yellow' },
  vista:    { label: 'VISTA Elite',  color: 'text-brutal-purple', bar: 'bg-brutal-purple' },
};

export default function BadgeGallery({ category, badges, newIds, onBadgeClick }) {
  const meta = CATEGORY_META[category] || { label: category, color: 'text-text-primary', bar: 'bg-brutal-black' };
  const unlocked = badges.filter(b => b.unlocked).length;
  const pct = badges.length ? Math.round((unlocked / badges.length) * 100) : 0;

  return (
    <div className="mb-8">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-3">
        <h2 className={`text-base font-heading font-bold ${meta.color}`}>{meta.label}</h2>
        <div className="flex-1 h-1.5 bg-bg-elevated rounded-full overflow-hidden">
          <div className={`h-full ${meta.bar} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs text-text-muted font-mono tabular-nums">{unlocked}/{badges.length}</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
        {badges.map(badge => (
          <BadgeCard
            key={badge.id}
            badge={badge}
            isNew={newIds?.includes(badge.id)}
            onClick={onBadgeClick}
          />
        ))}
      </div>
    </div>
  );
}
