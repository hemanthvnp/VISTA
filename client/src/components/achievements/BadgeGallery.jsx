import BadgeCard from './BadgeCard';

/** Badge gallery section for achievements page */
export default function BadgeGallery({ title, badges, onBadgeClick }) {
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-semibold text-text-primary">{title}</h2>
        <span className="text-sm text-text-muted">
          {unlockedCount} / {badges.length}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {badges.map((badge) => (
          <BadgeCard key={badge.id} badge={badge} onClick={onBadgeClick} />
        ))}
      </div>
    </div>
  );
}
