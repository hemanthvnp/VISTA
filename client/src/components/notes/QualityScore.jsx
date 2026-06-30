import { AlertTriangle, Sparkles, Layers, BookOpen, ListChecks } from 'lucide-react';
import BrutalCard from '../ui/BrutalCard';

function scoreColor(score) {
  if (score >= 85) return 'text-brutal-mint';
  if (score >= 70) return 'text-brutal-yellow';
  if (score >= 50) return 'text-brutal-purple';
  return 'text-brutal-coral';
}

const DIMENSIONS = [
  { key: 'clarity', label: 'Clarity', icon: Sparkles },
  { key: 'depth', label: 'Depth', icon: Layers },
  { key: 'structure', label: 'Structure', icon: ListChecks },
  { key: 'completeness', label: 'Completeness', icon: BookOpen },
];

export default function QualityScore({ score, feedback, stale }) {
  if (score === null || score === undefined) return null;

  return (
    <div className="space-y-3">
      {stale && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg border-2 border-brutal-yellow bg-brutal-yellow/10 text-xs text-text-primary">
          <AlertTriangle size={14} className="text-brutal-yellow flex-shrink-0" />
          This score is outdated — your note has changed since the last check. Run Check Quality again before publishing.
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className={`text-3xl font-mono font-bold ${scoreColor(score)}`}>{score}</div>
        <div className="flex-1">
          <div className="h-2 rounded-full bg-bg-elevated border border-brutal-black overflow-hidden">
            <div className={`h-full ${scoreColor(score).replace('text-', 'bg-')}`} style={{ width: `${score}%` }} />
          </div>
          <p className="text-xs text-text-muted mt-1">Publish-readiness / 100</p>
        </div>
      </div>

      {feedback && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {DIMENSIONS.map(({ key, label, icon: Icon }) => (
            <BrutalCard key={key} color="purple">
              <h4 className="text-xs font-bold uppercase tracking-wide text-text-secondary flex items-center gap-1.5 mb-1">
                <Icon size={12} /> {label}
              </h4>
              <p className="text-xs text-text-muted">{feedback[key]}</p>
            </BrutalCard>
          ))}
        </div>
      )}
    </div>
  );
}
