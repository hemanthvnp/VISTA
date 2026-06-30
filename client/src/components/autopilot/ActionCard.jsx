import { useNavigate } from 'react-router-dom';
import { BookOpen, Layers, FolderGit2, Zap, X } from 'lucide-react';
import BrutalCard from '../ui/BrutalCard';

const TYPE_META = {
  'lesson':          { icon: BookOpen,   color: 'text-brutal-yellow', bg: 'bg-brutal-yellow/10', label: 'Lesson' },
  'flashcard-review':{ icon: Layers,     color: 'text-brutal-coral',  bg: 'bg-brutal-coral/10',  label: 'Flashcards' },
  'code-project':    { icon: FolderGit2, color: 'text-brutal-mint',   bg: 'bg-brutal-mint/10',   label: 'Project' },
};

export default function ActionCard({ action, onDismiss }) {
  const navigate = useNavigate();
  const meta = TYPE_META[action.type] || { icon: Zap, color: 'text-text-primary', bg: '', label: action.type };
  const Icon = meta.icon;

  return (
    <BrutalCard className="flex items-start gap-4">
      <div className={`mt-0.5 p-2 rounded-lg border-2 border-brutal-black ${meta.bg} flex-shrink-0`}>
        <Icon size={18} className={meta.color} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-bold uppercase tracking-wide ${meta.color}`}>{meta.label}</span>
          {action.priority >= 4 && (
            <span className="text-xs bg-brutal-coral/20 text-brutal-coral border border-brutal-coral rounded-full px-1.5 font-semibold">
              Priority
            </span>
          )}
        </div>
        <p className="text-sm text-text-secondary leading-snug">{action.reason}</p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => navigate(action.payload?.route || '/')}
          className="px-3 py-1.5 rounded-lg border-2 border-brutal-black bg-brutal-black text-white text-xs font-bold shadow-brutal-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
        >
          Go
        </button>
        <button
          onClick={() => onDismiss?.(action.type)}
          className="p-1.5 rounded-lg border-2 border-brutal-black text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
          title="Dismiss for 24h"
        >
          <X size={14} />
        </button>
      </div>
    </BrutalCard>
  );
}
