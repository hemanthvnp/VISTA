/** @fileoverview Post-session results display: WPM, accuracy, duration, weak keys, XP earned */
import BrutalCard from '../ui/BrutalCard';
import { Keyboard, Target, Clock, AlertTriangle, Zap } from 'lucide-react';

export default function SessionStats({ wpm = 0, accuracy = 0, durationSecs = 0, errors = 0, totalChars = 0, xpEarned = 0, weakKeys = [] }) {
  const mins = Math.floor(durationSecs / 60);
  const secs = durationSecs % 60;

  return (
    <div className="animate-fadeIn">
      <h3 className="text-lg font-heading text-text-primary mb-4 flex items-center gap-2">
        <Zap className="text-brutal-yellow" size={20} /> Session Complete
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <BrutalCard color="cyan" className="text-center p-4">
          <Keyboard size={20} className="mx-auto text-brutal-mint mb-1" />
          <p className="text-2xl font-mono text-brutal-mint">{wpm}</p>
          <p className="text-xs text-text-muted">WPM</p>
        </BrutalCard>
        <BrutalCard color="gold" className="text-center p-4">
          <Target size={20} className="mx-auto text-brutal-yellow mb-1" />
          <p className="text-2xl font-mono text-brutal-yellow">{accuracy}%</p>
          <p className="text-xs text-text-muted">Accuracy</p>
        </BrutalCard>
        <BrutalCard color="purple" className="text-center p-4">
          <Clock size={20} className="mx-auto text-brutal-purple mb-1" />
          <p className="text-2xl font-mono text-brutal-purple">{mins}:{secs.toString().padStart(2, '0')}</p>
          <p className="text-xs text-text-muted">Duration</p>
        </BrutalCard>
        <BrutalCard color="gold" className="text-center p-4">
          <Zap size={20} className="mx-auto text-brutal-yellow mb-1" />
          <p className="text-2xl font-mono text-brutal-yellow">+{xpEarned}</p>
          <p className="text-xs text-text-muted">XP</p>
        </BrutalCard>
      </div>

      {weakKeys.length > 0 && (
        <div className="bg-bg-elevated rounded-lg p-3">
          <p className="text-sm text-text-muted flex items-center gap-1 mb-2">
            <AlertTriangle size={14} className="text-brutal-orange" /> Weak Keys
          </p>
          <div className="flex flex-wrap gap-2">
            {weakKeys.slice(0, 10).map((k) => (
              <span key={k} className="px-2 py-1 bg-bg-card border border-brutal-orange/30 rounded text-brutal-orange font-mono text-sm">
                {k}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
