/** @fileoverview Achievements page - badge gallery with categories and detail modal */
import { useState, useEffect } from 'react';
import { getAchievements, checkAchievements } from '../api/progress';
import BadgeGallery from '../components/achievements/BadgeGallery';
import BrutalCard from '../components/ui/BrutalCard';
import { Trophy, RefreshCw, X } from 'lucide-react';

const BADGE_DEFINITIONS = {
  typing: [
    { id: 'first-session', name: 'First Session', emoji: '???', description: 'Complete your first typing session', category: 'typing' },
    { id: 'wpm-20', name: 'Speed Starter', emoji: '????', description: 'Reach 20 WPM', category: 'typing' },
    { id: 'wpm-40', name: 'Rapid Typer', emoji: '????', description: 'Reach 40 WPM', category: 'typing' },
    { id: 'wpm-60', name: 'Speed Daemon', emoji: '????', description: 'Reach 60 WPM', category: 'typing' },
    { id: 'wpm-80', name: 'Lightning Fingers', emoji: '???', description: 'Reach 80 WPM', category: 'typing' },
    { id: 'wpm-100', name: 'Keyboard Legend', emoji: '????', description: 'Reach 100 WPM', category: 'typing' },
    { id: 'accuracy-95', name: 'Sharpshooter', emoji: '????', description: 'Score 95%+ accuracy in a session', category: 'typing' },
    { id: 'accuracy-99', name: 'Perfectionist', emoji: '????', description: 'Score 99%+ accuracy in a session', category: 'typing' },
    { id: 'sessions-10', name: 'Regular', emoji: '????', description: 'Complete 10 typing sessions', category: 'typing' },
    { id: 'sessions-50', name: 'Dedicated', emoji: '????', description: 'Complete 50 typing sessions', category: 'typing' },
    { id: 'sessions-100', name: 'Centurion', emoji: '????', description: 'Complete 100 typing sessions', category: 'typing' },
    { id: 'gate-streak-7', name: 'Gatekeeper', emoji: '????', description: 'Complete gates 7 days in a row', category: 'typing' },
    { id: 'gate-streak-30', name: 'Gate Master', emoji: '????', description: 'Complete gates 30 days in a row', category: 'typing' },
    { id: 'ml-analysis', name: 'Data Driven', emoji: '????', description: 'Run your first ML typing analysis', category: 'typing' },
  ],
  learning: [
    { id: 'first-note', name: 'Scribe', emoji: '????', description: 'Write your first note', category: 'learning' },
    { id: 'first-flashcard', name: 'Card Shark', emoji: '????', description: 'Review your first flashcard', category: 'learning' },
    { id: 'flashcards-50', name: 'Memory Palace', emoji: '????', description: 'Review 50 flashcards', category: 'learning' },
    { id: 'schedule-week', name: 'Planner', emoji: '????', description: 'Complete a schedule week', category: 'learning' },
    { id: 'schedule-5', name: 'On Track', emoji: '????', description: 'Complete 5 schedule weeks', category: 'learning' },
    { id: 'first-project', name: 'Builder', emoji: '????', description: 'Complete your first mini project', category: 'learning' },
    { id: 'projects-5', name: 'Craftsman', emoji: '???', description: 'Complete 5 mini projects', category: 'learning' },
    { id: 'projects-10', name: 'Master Builder', emoji: '????', description: 'Complete all 10 mini projects', category: 'learning' },
    { id: 'tutor-chat-10', name: 'Curious Mind', emoji: '????', description: 'Send 10 messages to the AI tutor', category: 'learning' },
    { id: 'tutor-chat-50', name: 'Knowledge Seeker', emoji: '????', description: 'Send 50 messages to the AI tutor', category: 'learning' },
    { id: 'code-run-10', name: 'Code Runner', emoji: '????', description: 'Run code 10 times in the playground', category: 'learning' },
    { id: 'resource-5', name: 'Collector', emoji: '????', description: 'Add 5 resources', category: 'learning' },
    { id: 'notes-5', name: 'Chronicler', emoji: '????', description: 'Write notes for 5 technologies', category: 'learning' },
  ],
  codec: [
    { id: 'level-2', name: 'Awakened', emoji: '????', description: 'Reach Level 2 (500 XP)', category: 'codec', xpBonus: 50 },
    { id: 'level-4', name: 'Rising Star', emoji: '???', description: 'Reach Level 4 (3500 XP)', category: 'codec', xpBonus: 100 },
    { id: 'level-6', name: 'Elite', emoji: '????', description: 'Reach Level 6 (12000 XP)', category: 'codec', xpBonus: 200 },
    { id: 'level-8', name: 'Legendary', emoji: '????', description: 'Reach Level 8 (35000 XP)', category: 'codec', xpBonus: 500 },
    { id: 'streak-bronze-3', name: 'Bronze Streak', emoji: '????', description: 'Maintain a 3-day streak', category: 'codec' },
    { id: 'streak-silver-7', name: 'Silver Streak', emoji: '????', description: 'Maintain a 7-day streak', category: 'codec' },
    { id: 'streak-gold-14', name: 'Gold Streak', emoji: '????', description: 'Maintain a 14-day streak', category: 'codec' },
    { id: 'streak-diamond-30', name: 'Diamond Streak', emoji: '????', description: 'Maintain a 30-day streak', category: 'codec' },
    { id: 'onboarding', name: 'Welcome', emoji: '????', description: 'Complete the onboarding flow', category: 'codec' },
    { id: 'tech-active-3', name: 'Multi-Tech', emoji: '????', description: 'Study 3 different technologies', category: 'codec' },
    { id: 'hours-10', name: 'Dedicated Learner', emoji: '???', description: 'Study for 10+ hours total', category: 'codec' },
    { id: 'hours-50', name: 'Scholar', emoji: '????', description: 'Study for 50+ hours total', category: 'codec' },
    { id: 'all-badges', name: 'Completionist', emoji: '????', description: 'Unlock all other badges', category: 'codec', xpBonus: 1000 },
  ],
};

export default function Achievements() {
  const [unlockedMap, setUnlockedMap] = useState({});
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAchievements();
        const achievements = data.achievements || data || [];
        const map = {};
        achievements.forEach((a) => {
          map[a.badgeId] = { unlocked: true, unlockedAt: a.unlockedAt || a.createdAt };
        });
        setUnlockedMap(map);
      } catch (e) {
        console.error('Achievements load error:', e);
      }
    };
    load();
  }, []);

  const handleCheck = async () => {
    setChecking(true);
    try {
      const data = await checkAchievements();
      const newBadges = data.newBadges || data.achievements || [];
      if (newBadges.length > 0) {
        const map = { ...unlockedMap };
        newBadges.forEach((a) => {
          map[a.badgeId || a.id] = { unlocked: true, unlockedAt: new Date().toISOString() };
        });
        setUnlockedMap(map);
      }
    } catch (e) {
      console.error('Check error:', e);
    } finally {
      setChecking(false);
    }
  };

  const mergeBadges = (badges) => {
    return badges.map((b) => ({
      ...b,
      unlocked: !!unlockedMap[b.id],
      unlockedAt: unlockedMap[b.id]?.unlockedAt || null,
    }));
  };

  const typingBadges = mergeBadges(BADGE_DEFINITIONS.typing);
  const learningBadges = mergeBadges(BADGE_DEFINITIONS.learning);
  const codecBadges = mergeBadges(BADGE_DEFINITIONS.codec);

  const totalUnlocked = Object.keys(unlockedMap).length;
  const totalBadges = BADGE_DEFINITIONS.typing.length + BADGE_DEFINITIONS.learning.length + BADGE_DEFINITIONS.codec.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-heading text-text-primary flex items-center gap-2">
          <Trophy className="text-brutal-yellow" size={22} /> Achievements
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-brutal-yellow font-mono">{totalUnlocked}/{totalBadges}</span>
          <button onClick={handleCheck} disabled={checking}
            className="px-3 py-1.5 text-xs border border-brutal-yellow/30 text-brutal-yellow rounded-lg hover:bg-brutal-yellow/10 flex items-center gap-1 disabled:opacity-50">
            <RefreshCw size={12} className={checking ? 'animate-spin' : ''} /> Check New
          </button>
        </div>
      </div>

      <BadgeGallery title="Typing Badges" badges={typingBadges} onBadgeClick={setSelectedBadge} />
      <BadgeGallery title="Learning Badges" badges={learningBadges} onBadgeClick={setSelectedBadge} />
      <BadgeGallery title="V Badges" badges={codecBadges} onBadgeClick={setSelectedBadge} />

      {/* Badge Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-overlay flex items-center justify-center z-50" onClick={() => setSelectedBadge(null)}>
          <BrutalCard color={selectedBadge.unlocked ? 'gold' : 'none'} className="max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedBadge(null)} className="absolute top-3 right-3 text-text-muted hover:text-text-secondary">
              <X size={16} />
            </button>
            <div className="text-center py-4">
              <span className="text-4xl block mb-3">{selectedBadge.emoji}</span>
              <h3 className="text-lg font-heading text-text-primary mb-1">{selectedBadge.name}</h3>
              <p className="text-sm text-text-secondary mb-3">{selectedBadge.description}</p>
              <span className={`text-xs px-2 py-1 rounded-full ${selectedBadge.unlocked
                ? 'bg-brutal-yellow/20 text-brutal-yellow border border-brutal-yellow/30'
                : 'bg-bg-elevated text-text-muted border border-brutal-black/30'
                }`}>
                {selectedBadge.unlocked ? 'Unlocked' : 'Locked'}
              </span>
              {selectedBadge.unlocked && selectedBadge.unlockedAt && (
                <p className="text-xs text-text-muted mt-2">
                  Unlocked {new Date(selectedBadge.unlockedAt).toLocaleDateString()}
                </p>
              )}
              {selectedBadge.xpBonus && (
                <p className="text-xs text-brutal-yellow mt-2">+{selectedBadge.xpBonus} XP bonus</p>
              )}
            </div>
          </BrutalCard>
        </div>
      )}
    </div>
  );
}
