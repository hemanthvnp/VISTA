/** @fileoverview Dashboard page - daily status board with stats, chart, achievements */
import { useEffect, useState, useMemo } from 'react';
import useAuthStore from '../store/useAuthStore';
import useAppStore from '../store/useAppStore';
import { getStats, getSessions } from '../api/typing';
import { getProgress, getAchievements } from '../api/progress';
import { TECHNOLOGIES } from '../utils/typingGeminiPrompt';
import BrutalCard from '../components/ui/BrutalCard';
import XPBadge from '../components/ui/XPBadge';
import StreakBadge from '../components/ui/StreakBadge';
import StatCard from '../components/dashboard/StatCard';
import StudyChart from '../components/dashboard/StudyChart';
import NextStepCard from '../components/dashboard/NextStepCard';
import { Clock, Keyboard, TrendingUp, Activity, Trophy } from 'lucide-react';

/** Build a 14-day daily WPM/session array from raw sessions */
function buildDailyStats(sessions) {
  const days = {};
  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    days[key] = { day: label, typing: 0, learning: 0 };
  }
  sessions.forEach((s) => {
    if (days[s.date]) {
      if (s.mode === 'lesson') {
        days[s.date].learning += Math.round((s.durationSecs || 0) / 60);
      } else {
        days[s.date].typing += Math.round((s.durationSecs || 0) / 60);
      }
    }
  });
  return Object.values(days);
}

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const { activeTech } = useAppStore();
  const [stats, setStats] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [progress, setProgress] = useState(null);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, sess, p, a] = await Promise.all([
          getStats(),
          getSessions(50),
          getProgress(),
          getAchievements(),
        ]);
        setStats(s);
        setSessions(Array.isArray(sess) ? sess : sess.sessions || []);
        setProgress(p);
        setBadges(a.achievements || a || []);
      } catch (e) {
        console.error('Dashboard load error:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const hoursTotal = stats
    ? Math.round((stats.totalPracticeSeconds || 0) / 360) / 10
    : 0;

  const currentWpm = stats?.avgWpm || 0;
  const bestWpm = stats?.bestWpm || 0;
  const sessionsToday = stats?.sessionsToday || 0;

  // Calculate overall tech progress % from the progress map
  const techProgressPct = useMemo(() => {
    if (!progress?.techProgress) return 0;
    const map = progress.techProgress;
    const total = TECHNOLOGIES.length;
    let sum = 0;
    TECHNOLOGIES.forEach((t) => {
      const p = map[t.id] || map.get?.(t.id);
      sum += p?.progress || 0;
    });
    return total > 0 ? Math.round(sum / total) : 0;
  }, [progress]);

  // Chart data from sessions
  const dailyStats = useMemo(() => buildDailyStats(sessions), [sessions]);

  // Active tech name for next-step card
  const activeTechObj = TECHNOLOGIES.find((t) => t.id === (user?.activeTechId || activeTech));
  const nextAction = activeTechObj
    ? `Keep pushing on ${activeTechObj.name}. Practice for at least 20 minutes today and complete a lesson.`
    : 'Pick an active technology on the Roadmap and start your first lesson.';

  // Derive last 3 unlocked badges, most recent first
  const recentBadges = badges
    .filter((b) => b.unlocked)
    .sort((a, b) => new Date(b.unlockedAt || 0) - new Date(a.unlockedAt || 0))
    .slice(0, 3);

  // Category colour mapping
  const categoryColor = {
    typing: { text: 'text-brutal-mint', bg: 'bg-brutal-mint/10', border: 'border-2 border-brutal-black' },
    learning: { text: 'text-brutal-purple', bg: 'bg-brutal-purple/10', border: 'border-2 border-brutal-black' },
    codec: { text: 'text-brutal-yellow', bg: 'bg-brutal-yellow/10', border: 'border-2 border-brutal-black' },
  };

  // Default emoji per category if badge has none
  const defaultEmoji = { typing: '⌨️', learning: '📚', codec: '⚡' };

  function relativeDate(iso) {
    if (!iso) return '';
    const diff = Math.floor((Date.now() - new Date(iso)) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 30) return `${diff}d ago`;
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  return (
    <div className="space-y-6">
      {/* XP + Streak Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-lg">
          <XPBadge xp={user?.xp || 0} />
        </div>
        <StreakBadge count={user?.streak?.count || 0} type={user?.streak?.type} />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Clock}
          label="Total Practice"
          value={`${hoursTotal}h`}
          subtitle="all time"
          color="cyan"
        />
        <StatCard
          icon={Keyboard}
          label="Avg WPM"
          value={currentWpm}
          subtitle={`best: ${bestWpm}`}
          color="purple"
        />
        <StatCard
          icon={TrendingUp}
          label="Tech Progress"
          value={`${techProgressPct}%`}
          subtitle={`${TECHNOLOGIES.length} techs`}
          color="gold"
        />
        <StatCard
          icon={Activity}
          label="Sessions Today"
          value={sessionsToday}
          subtitle={`${stats?.totalSessions || 0} total`}
          color="orange"
        />
      </div>

      {/* Chart + Next Step */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <BrutalCard>
            <h3 className="text-sm font-heading text-text-secondary mb-3">
              Study Activity — last 14 days <span className="text-text-muted font-normal text-xs">(minutes)</span>
            </h3>
            <StudyChart data={dailyStats} />
          </BrutalCard>
        </div>
        <NextStepCard action={nextAction} tech={activeTechObj?.name} />
      </div>

      {/* Recent Achievements */}
      <div>
        <h3 className="text-sm font-heading text-text-secondary mb-3 flex items-center gap-2">
          <Trophy size={16} className="text-brutal-yellow" />
          Recent Achievements
          {recentBadges.length > 0 && (
            <span className="text-xs text-text-muted font-normal ml-1">
              {badges.filter(b => b.unlocked).length} / {badges.length} unlocked
            </span>
          )}
        </h3>

        {recentBadges.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {recentBadges.map((b) => {
              const col = categoryColor[b.category] || categoryColor.typing;
              const emoji = b.emoji || defaultEmoji[b.category] || '🏅';
              return (
                <div
                  key={b.id}
                  className={`rounded-lg border-2 border-brutal-black p-4 ${col.bg} shadow-brutal-sm flex items-start gap-3`}
                >
                  <span className="text-2xl flex-shrink-0">{emoji}</span>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold ${col.text} truncate`}>{b.name}</p>
                    <p className="text-xs text-text-muted mt-0.5 leading-tight line-clamp-2">{b.description}</p>
                    <p className="text-xs text-text-muted mt-1.5">{relativeDate(b.unlockedAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          !loading && (
            <BrutalCard className="text-center py-5">
              <Trophy size={24} className="text-text-muted mx-auto mb-2" />
              <p className="text-text-muted text-sm">No badges yet — complete your first gate or lesson!</p>
            </BrutalCard>
          )
        )}
      </div>

      {/* Empty state when no sessions yet */}
      {!loading && stats?.totalSessions === 0 && (
        <BrutalCard className="text-center py-8">
          <p className="text-text-muted text-sm">No sessions yet — head to the Typing page and start practicing!</p>
        </BrutalCard>
      )}
    </div>
  );
}

