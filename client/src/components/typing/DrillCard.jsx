/** @fileoverview AI-generated bonus drill card for targeted typing practice */
import { Zap, Clock } from 'lucide-react';

export default function DrillCard({ drill, onStart, completed = false }) {
  if (!drill) return null;

  return (
    <div className={`p-4 rounded-xl border transition-all ${
      completed ? 'bg-success-muted border-success-border' : 'bg-bg-card border-brutal-purple/30 hover:border-brutal-purple'
    }`}>
      <div className="flex items-start justify-between">
        <div>
          <h4 className={`text-sm font-semibold ${completed ? 'text-success-text' : 'text-brutal-purple'}`}>
            <Zap size={14} className="inline mr-1" />
            {drill.title}
          </h4>
          <p className="text-xs text-text-muted mt-1">{drill.description}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
            <span className="flex items-center gap-1"><Clock size={12} /> {drill.duration_secs}s</span>
            <span>Target: {drill.target}</span>
          </div>
        </div>
        {!completed && onStart && (
          <button
            onClick={() => onStart(drill)}
            className="px-3 py-1.5 bg-brutal-purple/20 text-brutal-purple border border-brutal-purple/30 rounded-lg text-xs hover:bg-brutal-purple/30"
          >
            Start +30 XP
          </button>
        )}
      </div>
    </div>
  );
}
