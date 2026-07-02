import { useNavigate } from 'react-router-dom';
import { BookOpen, Layers, FolderGit2, Keyboard, ArrowRight, Sparkles } from 'lucide-react';
import BrutalCard from '../ui/BrutalCard';

function buildActions({ stats, progress, badges, activeTechObj }) {
  const actions = [];
  const lessonsTotal = Object.keys(progress?.lessonProgress || {}).length;
  const unlockedBadges = (badges || []).filter(b => b.unlocked).length;

  // Priority 1 — no activity today
  if ((stats?.sessionsToday || 0) === 0) {
    actions.push({
      icon: Keyboard,
      color: 'text-brutal-mint',
      bg: 'bg-brutal-mint/10',
      tag: 'Daily',
      title: 'Start today\'s session',
      desc: 'You haven\'t practiced yet — keep your streak alive.',
      route: '/learn',
    });
  }

  // Priority 2 — continue active tech
  if (activeTechObj) {
    actions.push({
      icon: BookOpen,
      color: 'text-brutal-yellow',
      bg: 'bg-brutal-yellow/10',
      tag: activeTechObj.name,
      title: `Continue learning`,
      desc: `Pick up where you left off in ${activeTechObj.name}.`,
      route: `/learn/${activeTechObj.id}`,
    });
  }

  // Priority 3 — flashcards
  actions.push({
    icon: Layers,
    color: 'text-brutal-purple',
    bg: 'bg-brutal-purple/10',
    tag: 'Flashcards',
    title: 'Review your cards',
    desc: 'Spaced repetition locks concepts in long-term memory.',
    route: '/flashcards',
  });

  // Priority 4 — build a project if no badges yet
  if (unlockedBadges < 2 && lessonsTotal >= 2) {
    actions.push({
      icon: FolderGit2,
      color: 'text-brutal-coral',
      bg: 'bg-brutal-coral/10',
      tag: 'Project',
      title: 'Submit a project',
      desc: 'Build something real and earn your first Builder badge.',
      route: '/projects',
    });
  }

  return actions.slice(0, 3);
}

export default function NextStepCard({ stats, progress, badges, activeTechObj }) {
  const navigate = useNavigate();
  const actions = buildActions({ stats, progress, badges, activeTechObj });

  return (
    <BrutalCard className="flex flex-col gap-0 p-0 overflow-hidden">
      <div className="px-4 pt-4 pb-3 border-b border-brutal-black/20">
        <h3 className="text-sm font-heading text-text-secondary flex items-center gap-1.5">
          <Sparkles size={14} className="text-brutal-purple" />
          Next Best Actions
        </h3>
      </div>
      <div className="divide-y divide-brutal-black/10">
        {actions.map((a, i) => {
          const Icon = a.icon;
          return (
            <button
              key={i}
              onClick={() => navigate(a.route)}
              className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-bg-elevated transition-colors group"
            >
              <div className={`mt-0.5 p-1.5 rounded-lg border border-brutal-black/30 ${a.bg} flex-shrink-0`}>
                <Icon size={14} className={a.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${a.color}`}>{a.tag}</span>
                </div>
                <p className="text-xs font-semibold text-text-primary leading-snug">{a.title}</p>
                <p className="text-[11px] text-text-muted leading-snug mt-0.5 line-clamp-1">{a.desc}</p>
              </div>
              <ArrowRight size={13} className="text-text-muted flex-shrink-0 mt-1 group-hover:text-text-secondary group-hover:translate-x-0.5 transition-all" />
            </button>
          );
        })}
      </div>
    </BrutalCard>
  );
}
