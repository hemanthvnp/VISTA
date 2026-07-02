/** @fileoverview Dashboard — personalized learning command center */
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useAppStore from '../store/useAppStore';
import { getStats, getSessions } from '../api/typing';
import { getProgress, getAchievements } from '../api/progress';
import { TECHNOLOGIES } from '../utils/typingGeminiPrompt';
import { ALL_TECHS } from '../utils/learnCurriculum';
import BrutalCard from '../components/ui/BrutalCard';
import XPBadge from '../components/ui/XPBadge';
import StreakBadge from '../components/ui/StreakBadge';
import StatCard from '../components/dashboard/StatCard';
import StudyChart from '../components/dashboard/StudyChart';
import NextStepCard from '../components/dashboard/NextStepCard';
import AutoPilotDashboard from '../components/autopilot/AutoPilotDashboard';
import useAutoPilotStore from '../store/useAutoPilotStore';
import useAutoPilot from '../hooks/useAutoPilot';
import {
  Clock, Keyboard, TrendingUp, Activity, Trophy,
  ChevronRight, BookOpen, Eye,
} from 'lucide-react';

function greeting(name) {
  const h = new Date().getHours();
  const part = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
  return `Good ${part}, ${name || 'Pilot'} 👋`;
}

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
      if (s.mode === 'lesson') days[s.date].learning += Math.round((s.durationSecs || 0) / 60);
      else days[s.date].typing += Math.round((s.durationSecs || 0) / 60);
    }
  });
  return Object.values(days);
}

const BADGE_CATEGORY_COLOR = {
  learner:  { text: 'text-brutal-mint',   bg: 'bg-brutal-mint/10'   },
  builder:  { text: 'text-brutal-blue',   bg: 'bg-brutal-blue/10'   },
  grind:    { text: 'text-brutal-coral',  bg: 'bg-brutal-coral/10'  },
  explorer: { text: 'text-brutal-yellow', bg: 'bg-brutal-yellow/10' },
  vista:    { text: 'text-brutal-purple', bg: 'bg-brutal-purple/10' },
};

function relativeDate(iso) {
  if (!iso) return '';
  const diff = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 30) return `${diff}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { activeTech } = useAppStore();
  const autoPilotEnabled = useAutoPilotStore((s) => s.enabled);
  useAutoPilot();

  const [stats, setStats] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [progress, setProgress] = useState(null);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [s, sess, p, a] = await Promise.all([
          getStats(), getSessions(50), getProgress(), getAchievements(),
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
    })();
  }, []);

  // ── Derived values ─────────────────────────────────────────────────────────
  const hoursTotal = stats ? Math.round((stats.totalPracticeSeconds || 0) / 360) / 10 : 0;
  const currentWpm = stats?.avgWpm || 0;
  const bestWpm    = stats?.bestWpm || 0;
  const todaySessions = stats?.sessionsToday || 0;

  const activeTechObj = TECHNOLOGIES.find(t => t.id === (user?.activeTechId || activeTech));

  // Tech progress %
  const techProgressPct = useMemo(() => {
    if (!progress?.techProgress) return 0;
    const map = progress.techProgress;
    let sum = 0;
    TECHNOLOGIES.forEach(t => { sum += (map[t.id] || map.get?.(t.id))?.progress || 0; });
    return TECHNOLOGIES.length > 0 ? Math.round(sum / TECHNOLOGIES.length) : 0;
  }, [progress]);

  // Completed lesson topics for active tech
  const activeTechTopicsDone = useMemo(() => {
    if (!activeTechObj || !progress?.lessonProgress) return { done: 0, total: 0 };
    const curriculum = ALL_TECHS.find(t => t.id === activeTechObj.id);
    const total = curriculum?.topics?.length || 0;
    const done = Object.keys(progress.lessonProgress).filter(k => k.startsWith(activeTechObj.id + '-')).length;
    return { done, total };
  }, [activeTechObj, progress]);

  // Chart
  const dailyStats = useMemo(() => buildDailyStats(sessions), [sessions]);

  // Badges
  const unlockedBadges = badges.filter(b => b.unlocked);
  const recentBadges = [...unlockedBadges]
    .sort((a, b) => new Date(b.unlockedAt || 0) - new Date(a.unlockedAt || 0))
    .slice(0, 4);

  const wpmPct = bestWpm > 0 ? Math.round((currentWpm / Math.max(bestWpm, 1)) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* ── Greeting header ────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-heading text-text-primary">
            {greeting(user?.displayName || user?.username)}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {todaySessions > 0
              ? `${todaySessions} session${todaySessions > 1 ? 's' : ''} done today · keep the momentum going`
              : 'No sessions yet today — let\'s get started'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <StreakBadge count={user?.streak?.count || 0} type={user?.streak?.type} />
          <div className="w-px h-8 bg-brutal-black/20" />
          <div className="min-w-[180px]">
            <XPBadge xp={user?.xp || 0} />
          </div>
        </div>
      </div>

      {/* ── Quick Stats ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={Clock}
          label="Study Hours"
          value={`${hoursTotal}h`}
          subtitle="all time"
          color="cyan"
          pct={Math.min((hoursTotal / 100) * 100, 100)}
        />
        <StatCard
          icon={Keyboard}
          label="Avg WPM"
          value={currentWpm}
          subtitle={`best: ${bestWpm} wpm`}
          color="purple"
          pct={wpmPct}
        />
        <StatCard
          icon={TrendingUp}
          label="Tech Progress"
          value={`${techProgressPct}%`}
          subtitle={`${TECHNOLOGIES.length} technologies`}
          color="gold"
          pct={techProgressPct}
        />
        <StatCard
          icon={Activity}
          label="Today"
          value={todaySessions}
          subtitle={`${stats?.totalSessions || 0} sessions total`}
          color="orange"
          pct={Math.min(todaySessions * 25, 100)}
        />
      </div>

      {/* ── Active Tech Card ───────────────────────────────────────────────── */}
      {activeTechObj && (
        <button
          onClick={() => navigate(`/learn/${activeTechObj.id}`)}
          className="w-full text-left"
        >
          <BrutalCard className="group hover:shadow-brutal-md transition-all duration-200 hover:-translate-y-0.5">
            <div className="flex items-center gap-4">
              <span className="text-3xl flex-shrink-0">{activeTechObj.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-brutal-purple uppercase tracking-wider">Active Tech</span>
                  {activeTechTopicsDone.total > 0 && (
                    <span className="text-xs text-text-muted font-mono">
                      {activeTechTopicsDone.done}/{activeTechTopicsDone.total} topics
                    </span>
                  )}
                </div>
                <p className="text-base font-heading font-semibold text-text-primary">{activeTechObj.name}</p>
                <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{activeTechObj.description}</p>
              </div>
              {activeTechTopicsDone.total > 0 && (
                <div className="flex-shrink-0 text-center">
                  <div className="text-lg font-mono font-bold text-brutal-yellow">
                    {activeTechTopicsDone.total > 0
                      ? Math.round((activeTechTopicsDone.done / activeTechTopicsDone.total) * 100)
                      : 0}%
                  </div>
                  <div className="text-[10px] text-text-muted">complete</div>
                </div>
              )}
              <ChevronRight size={18} className="text-text-muted flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </div>
            {activeTechTopicsDone.total > 0 && (
              <div className="mt-3 h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                <div
                  className="h-full bg-brutal-yellow rounded-full transition-all duration-700"
                  style={{ width: `${Math.round((activeTechTopicsDone.done / activeTechTopicsDone.total) * 100)}%` }}
                />
              </div>
            )}
          </BrutalCard>
        </button>
      )}

      {/* ── AutoPilot queue or Chart + Next Actions ────────────────────────── */}
      {autoPilotEnabled ? (
        <AutoPilotDashboard />
      ) : (
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <BrutalCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-heading text-text-secondary">
                  Study Activity
                  <span className="text-text-muted font-normal text-xs ml-1">— last 14 days</span>
                </h3>
                {hoursTotal > 0 && (
                  <span className="text-xs text-text-muted font-mono">{hoursTotal}h logged</span>
                )}
              </div>
              <StudyChart data={dailyStats} />
            </BrutalCard>
          </div>
          <NextStepCard
            stats={stats}
            progress={progress}
            badges={badges}
            activeTechObj={activeTechObj}
          />
        </div>
      )}

      {/* ── Recent Achievements ────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-heading text-text-secondary flex items-center gap-2">
            <Trophy size={15} className="text-brutal-yellow" />
            Recent Achievements
          </h3>
          <div className="flex items-center gap-2">
            {badges.length > 0 && (
              <span className="text-xs text-text-muted">
                {unlockedBadges.length}/{badges.length} unlocked
              </span>
            )}
            <button
              onClick={() => navigate('/achievements')}
              className="text-xs text-brutal-purple hover:underline flex items-center gap-0.5"
            >
              View all <ChevronRight size={11} />
            </button>
          </div>
        </div>

        {recentBadges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {recentBadges.map((b) => {
              const col = BADGE_CATEGORY_COLOR[b.category] || BADGE_CATEGORY_COLOR.learner;
              return (
                <div
                  key={b.id}
                  className={`rounded-xl border-2 border-brutal-black p-3 ${col.bg} flex flex-col items-center text-center gap-1.5`}
                >
                  <span className="text-2xl">{b.emoji || '🏅'}</span>
                  <p className={`text-xs font-bold leading-tight ${col.text}`}>{b.name}</p>
                  <p className="text-[10px] text-text-muted leading-tight line-clamp-2">{b.description}</p>
                  <p className="text-[10px] text-text-muted mt-auto">{relativeDate(b.unlockedAt)}</p>
                </div>
              );
            })}
          </div>
        ) : (
          !loading && (
            <BrutalCard className="flex items-center gap-4 py-5">
              <div className="p-3 rounded-xl bg-brutal-yellow/10 border border-brutal-black/20">
                <Trophy size={22} className="text-brutal-yellow" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">No badges yet</p>
                <p className="text-xs text-text-muted mt-0.5">
                  Complete a lesson or daily gate to earn your first achievement.
                </p>
              </div>
              <button
                onClick={() => navigate('/achievements')}
                className="ml-auto px-3 py-1.5 text-xs border-2 border-brutal-black rounded-lg text-text-secondary hover:border-brutal-purple hover:text-brutal-purple transition-colors flex-shrink-0"
              >
                Browse
              </button>
            </BrutalCard>
          )
        )}
      </div>

      {/* ── VISTA brand footer ─────────────────────────────────────────────── */}
      {!loading && stats?.totalSessions === 0 && (
        <BrutalCard className="text-center py-8">
          <Eye size={32} className="text-brutal-purple mx-auto mb-3 opacity-60" />
          <p className="font-heading text-text-primary mb-1">Welcome to VISTA</p>
          <p className="text-sm text-text-muted mb-4">Your journey starts here. Pick a technology and begin your first lesson.</p>
          <button
            onClick={() => navigate('/learn')}
            className="px-5 py-2 bg-brutal-purple text-white border-2 border-brutal-black rounded-lg text-sm font-semibold hover:bg-brutal-purple/90 transition-colors"
          >
            Start Learning
          </button>
        </BrutalCard>
      )}
    </div>
  );
}
