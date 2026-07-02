/** @fileoverview Achievements page — badge gallery with auto-check, category tabs, and detail modal */
import { useState, useEffect, useCallback } from 'react';
import { getAchievements, checkAchievements } from '../api/progress';
import BadgeGallery from '../components/achievements/BadgeGallery';
import BrutalCard from '../components/ui/BrutalCard';
import { Trophy, RefreshCw, X, Zap } from 'lucide-react';

const CATEGORIES = ['all', 'learner', 'builder', 'grind', 'explorer', 'vista'];

const CATEGORY_LABELS = {
  all: 'All',
  learner: 'Learner',
  builder: 'Builder',
  grind: 'Daily Grind',
  explorer: 'Explorer',
  vista: 'VISTA Elite',
};

const CATEGORY_COLORS = {
  all:      { active: 'bg-brutal-black text-white',      idle: 'text-text-muted hover:text-text-primary' },
  learner:  { active: 'bg-brutal-mint text-bg-primary',  idle: 'text-brutal-mint/60 hover:text-brutal-mint' },
  builder:  { active: 'bg-brutal-blue text-white',       idle: 'text-brutal-blue/60 hover:text-brutal-blue' },
  grind:    { active: 'bg-brutal-coral text-white',      idle: 'text-brutal-coral/60 hover:text-brutal-coral' },
  explorer: { active: 'bg-brutal-yellow text-bg-primary',idle: 'text-brutal-yellow/60 hover:text-brutal-yellow' },
  vista:    { active: 'bg-brutal-purple text-white',     idle: 'text-brutal-purple/60 hover:text-brutal-purple' },
};

export default function Achievements() {
  const [badges, setBadges] = useState([]);
  const [newIds, setNewIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedBadge, setSelectedBadge] = useState(null);

  const runCheck = useCallback(async () => {
    setChecking(true);
    try {
      const data = await checkAchievements();
      setBadges(data.allBadges || []);
      if (data.newBadges?.length) setNewIds(data.newBadges);
    } catch (e) {
      console.error('Achievement check error:', e);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const data = await getAchievements();
        setBadges(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Achievements load error:', e);
      } finally {
        setLoading(false);
      }
      runCheck();
    };
    init();
  }, [runCheck]);

  const totalUnlocked = badges.filter(b => b.unlocked).length;
  const totalBadges   = badges.length;
  const pct           = totalBadges ? Math.round((totalUnlocked / totalBadges) * 100) : 0;
  const xpFromBadges  = badges.filter(b => b.unlocked && b.xpBonus).reduce((s, b) => s + b.xpBonus, 0);

  const groupedByCategory = CATEGORIES.slice(1).reduce((acc, cat) => {
    acc[cat] = badges.filter(b => b.category === cat);
    return acc;
  }, {});

  const visibleCategories = activeTab === 'all'
    ? CATEGORIES.slice(1)
    : [activeTab];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-text-muted text-sm animate-pulse">
        Loading achievements...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-heading text-text-primary flex items-center gap-2">
          <Trophy className="text-brutal-yellow" size={22} /> Achievements
        </h1>
        <button
          onClick={runCheck}
          disabled={checking}
          className="px-3 py-1.5 text-xs border-2 border-brutal-black rounded-lg text-text-secondary hover:border-brutal-purple hover:text-brutal-purple flex items-center gap-1.5 disabled:opacity-50 transition-colors"
        >
          <RefreshCw size={12} className={checking ? 'animate-spin' : ''} />
          {checking ? 'Checking...' : 'Sync'}
        </button>
      </div>

      {/* Stats bar */}
      <BrutalCard>
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex-1 min-w-[160px]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-text-muted">Overall Progress</span>
              <span className="text-xs font-mono text-brutal-yellow">{totalUnlocked}/{totalBadges}</span>
            </div>
            <div className="h-2 bg-bg-elevated rounded-full overflow-hidden border border-brutal-black">
              <div
                className="h-full bg-brutal-yellow rounded-full transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <div className="text-center">
            <p className="text-2xl font-mono font-bold text-brutal-yellow">{pct}%</p>
            <p className="text-xs text-text-muted">Complete</p>
          </div>
          {xpFromBadges > 0 && (
            <div className="text-center">
              <p className="text-2xl font-mono font-bold text-brutal-purple flex items-center gap-1">
                <Zap size={18} className="fill-current" />{xpFromBadges.toLocaleString()}
              </p>
              <p className="text-xs text-text-muted">XP from badges</p>
            </div>
          )}
          {newIds.length > 0 && (
            <div className="text-center">
              <p className="text-2xl font-mono font-bold text-brutal-coral">{newIds.length}</p>
              <p className="text-xs text-text-muted">New today</p>
            </div>
          )}
        </div>
      </BrutalCard>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => {
          const colors = CATEGORY_COLORS[cat];
          const isActive = activeTab === cat;
          const count = cat === 'all' ? totalUnlocked : (groupedByCategory[cat]?.filter(b => b.unlocked).length || 0);
          const total = cat === 'all' ? totalBadges : (groupedByCategory[cat]?.length || 0);
          return (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 border-brutal-black transition-all ${
                isActive ? colors.active : `bg-bg-card ${colors.idle}`
              }`}
            >
              {CATEGORY_LABELS[cat]}
              <span className="ml-1.5 opacity-70 font-mono">{count}/{total}</span>
            </button>
          );
        })}
      </div>

      {/* Badge galleries */}
      {visibleCategories.map(cat => (
        groupedByCategory[cat]?.length > 0 && (
          <BadgeGallery
            key={cat}
            category={cat}
            badges={groupedByCategory[cat]}
            newIds={newIds}
            onBadgeClick={setSelectedBadge}
          />
        )
      ))}

      {/* Detail modal */}
      {selectedBadge && (
        <div
          className="fixed inset-0 bg-overlay flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedBadge(null)}
        >
          <BrutalCard
            color={selectedBadge.unlocked ? 'purple' : 'none'}
            className="max-w-xs w-full relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-3 right-3 text-text-muted hover:text-text-secondary"
            >
              <X size={16} />
            </button>

            <div className="text-center py-2">
              <div className="text-5xl mb-3">{selectedBadge.emoji}</div>
              <h3 className="text-lg font-heading font-bold text-text-primary mb-1">{selectedBadge.name}</h3>
              <p className="text-sm text-text-secondary mb-4 leading-relaxed">{selectedBadge.description}</p>

              <div className="flex items-center justify-center gap-3 flex-wrap">
                <span className={`text-xs px-3 py-1 rounded-full border-2 border-brutal-black font-semibold ${
                  selectedBadge.unlocked
                    ? 'bg-brutal-mint/20 text-brutal-mint'
                    : 'bg-bg-elevated text-text-muted'
                }`}>
                  {selectedBadge.unlocked ? '✓ Unlocked' : '🔒 Locked'}
                </span>

                {selectedBadge.xpBonus && (
                  <span className="text-xs px-3 py-1 rounded-full border-2 border-brutal-black bg-brutal-purple/10 text-brutal-purple font-semibold">
                    +{selectedBadge.xpBonus} XP
                  </span>
                )}
              </div>

              {selectedBadge.unlocked && selectedBadge.unlockedAt && (
                <p className="text-xs text-text-muted mt-3">
                  Unlocked on {new Date(selectedBadge.unlockedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              )}

              <span className="inline-block text-[10px] text-text-muted mt-2 uppercase tracking-wider">
                {CATEGORY_LABELS[selectedBadge.category]} badge
              </span>
            </div>
          </BrutalCard>
        </div>
      )}
    </div>
  );
}
