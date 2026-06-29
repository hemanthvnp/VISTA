import { Shuffle, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

/** Flashcard navigation and session controls */
export default function CardControls({ current, total, onPrev, onNext, onShuffle, onReset, stats }) {
  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      <div className="flex items-center gap-4">
        <button onClick={onPrev} className="p-2 rounded-lg bg-bg-card border border-brutal-black hover:border-brutal-mint text-text-muted hover:text-brutal-mint transition-colors">
          <ChevronLeft size={20} />
        </button>
        <span className="text-sm text-text-muted font-mono min-w-[60px] text-center">
          {current + 1} / {total}
        </span>
        <button onClick={onNext} className="p-2 rounded-lg bg-bg-card border border-brutal-black hover:border-brutal-mint text-text-muted hover:text-brutal-mint transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="flex gap-3">
        <button onClick={onShuffle} className="flex items-center gap-1 text-xs text-text-muted hover:text-brutal-mint transition-colors">
          <Shuffle size={14} /> Shuffle
        </button>
        <button onClick={onReset} className="flex items-center gap-1 text-xs text-text-muted hover:text-brutal-orange transition-colors">
          <RotateCcw size={14} /> Reset
        </button>
      </div>
      {stats && (
        <div className="flex gap-4 text-xs text-text-muted">
          <span>Reviewed: {stats.reviewed}</span>
          <span className="text-brutal-mint">Got It: {stats.gotIt}</span>
          <span>Accuracy: {stats.reviewed > 0 ? Math.round((stats.gotIt / stats.reviewed) * 100) : 0}%</span>
        </div>
      )}
    </div>
  );
}
