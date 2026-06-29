/** @fileoverview Lesson card for L1-L8 curriculum with progress and lock/unlock state */
import { Lock, Check, Play } from 'lucide-react';

export default function LessonCard({ lesson, isUnlocked = false, isComplete = false, isCurrent = false, onStart }) {
  return (
    <div
      className={`p-4 rounded-xl border transition-all ${
        isComplete
          ? 'bg-success-muted border-success-border'
          : isCurrent
          ? 'bg-brutal-mint/5 border-brutal-mint/30 shadow-brutal-md'
          : isUnlocked
          ? 'bg-bg-card border-brutal-black hover:border-border-muted cursor-pointer'
          : 'bg-bg-card/50 border-brutal-black opacity-60'
      }`}
      onClick={() => isUnlocked && !isComplete && onStart && onStart(lesson)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isComplete ? 'bg-success-soft' : isCurrent ? 'bg-brutal-mint/20' : 'bg-bg-elevated'
          }`}>
            {isComplete ? (
              <Check size={16} className="text-success-text" />
            ) : !isUnlocked ? (
              <Lock size={14} className="text-text-muted" />
            ) : (
              <Play size={14} className={`${isCurrent ? 'text-brutal-mint' : 'text-text-muted'}`} />
            )}
          </div>
          <div>
            <h4 className={`text-sm font-semibold ${isComplete ? 'text-success-text' : isCurrent ? 'text-brutal-mint' : 'text-text-secondary'}`}>
              {lesson.name}
            </h4>
            <p className="text-xs text-text-muted">{lesson.keys} — {lesson.wpmTarget} WPM target</p>
          </div>
        </div>
        {isUnlocked && !isComplete && (
          <span className="text-xs text-brutal-mint">+75 XP</span>
        )}
      </div>
    </div>
  );
}
