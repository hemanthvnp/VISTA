/** @fileoverview Timer display component - supports countdown and countup modes */
import { formatTime } from '../../utils/dateUtils';
import { Clock, Pause, Play } from 'lucide-react';

export default function Timer({ seconds = 0, isRunning = false, onToggle, mode = 'up', label, className = '' }) {
  const displayTime = mode === 'down' && seconds < 0 ? 0 : Math.abs(Math.floor(seconds));

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && <span className="text-xs text-text-muted uppercase tracking-wider">{label}</span>}
      <Clock size={16} className={`${isRunning ? 'text-brutal-mint' : 'text-text-muted'}`} />
      <span className={`font-mono text-sm font-semibold ${isRunning ? 'text-brutal-mint' : 'text-text-secondary'}`}>
        {formatTime(displayTime)}
      </span>
      {onToggle && (
        <button
          onClick={onToggle}
          className="p-1 rounded hover:bg-bg-elevated transition-colors"
        >
          {isRunning ? <Pause size={14} className="text-text-secondary" /> : <Play size={14} className="text-brutal-mint" />}
        </button>
      )}
    </div>
  );
}
