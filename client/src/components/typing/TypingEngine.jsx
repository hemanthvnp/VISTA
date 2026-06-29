/** @fileoverview Core typing UI - displays text, captures input, shows live WPM/accuracy */
import { useState, useCallback } from 'react';
import useTypingSession from '../../hooks/useTypingSession';
import TypingText from './TypingText';
import SessionStats from './SessionStats';
import { Play, RotateCcw } from 'lucide-react';
import { formatTime } from '../../utils/dateUtils';
import { getFingerForKey, FINGER_NAMES } from '../../utils/fingerMap';

export default function TypingEngine({ text = '', duration = 60, mode = 'words', onSessionComplete, showKeyboard = false }) {
  const [xpEarned, setXpEarned] = useState(0);

  const handleComplete = useCallback((data) => {
    setXpEarned(20); // voluntary_session XP
    if (onSessionComplete) onSessionComplete(data);
  }, [onSessionComplete]);

  const session = useTypingSession({ text, duration, onComplete: handleComplete });
  const nextKey = text[session.currentIndex] || '';
  const fingerInfo = getFingerForKey(nextKey);

  // Determine weak keys from session
  const weakKeys = [];
  if (session.isComplete && session.keypresses.length > 0) {
    const keyErrors = {};
    session.keypresses.forEach((kp) => {
      if (!kp.isCorrect) {
        keyErrors[kp.expectedKey] = (keyErrors[kp.expectedKey] || 0) + 1;
      }
    });
    Object.entries(keyErrors)
      .sort((a, b) => b[1] - a[1])
      .forEach(([key]) => weakKeys.push(key));
  }

  if (session.isComplete) {
    return (
      <div>
        <SessionStats
          wpm={session.wpm}
          accuracy={session.accuracy}
          durationSecs={duration - session.timeLeft}
          errors={session.errors}
          totalChars={session.totalChars}
          xpEarned={xpEarned}
          weakKeys={weakKeys}
        />
        <button
          onClick={session.resetSession}
          className="mt-4 px-5 py-2.5 bg-bg-elevated border-2 border-brutal-black shadow-[3px_3px_0px_var(--shadow-color)] text-text-primary text-sm font-semibold hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-150 flex items-center gap-2"
        >
          <RotateCcw size={14} /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {!session.isActive ? (
        <div className="text-center py-12">
          <p className="text-text-muted mb-4">Ready to type? Click start when prepared.</p>
          <button
            onClick={session.startSession}
            className="px-8 py-4 bg-brutal-mint text-text-primary border-2 border-brutal-black shadow-[5px_5px_0px_var(--shadow-color)] font-bold text-base hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] transition-all duration-150 flex items-center gap-3 mx-auto"
          >
            <Play size={20} /> Start Session
          </button>
        </div>
      ) : (
        <>
          {/* Timer and stats bar */}
          <div className="flex items-center justify-between mb-4 bg-bg-elevated rounded-lg px-4 py-2">
            <div className="flex items-center gap-4 text-sm">
              <span className="font-mono text-brutal-mint text-lg">{formatTime(session.timeLeft)}</span>
              <span className="text-text-muted">|</span>
              <span className="text-text-muted">WPM: <span className="text-brutal-mint font-mono">{session.wpm}</span></span>
              <span className="text-text-muted">Acc: <span className="text-brutal-yellow font-mono">{session.accuracy}%</span></span>
            </div>
            <div className="text-xs text-text-muted">
              {nextKey && (
                <span>Use: <span style={{ color: fingerInfo.color }}>{FINGER_NAMES[fingerInfo.finger]}</span></span>
              )}
            </div>
          </div>

          {/* Typing text */}
          <div className="bg-bg-card border border-brutal-black rounded-xl p-6 overflow-hidden">
            <TypingText text={text} currentIndex={session.currentIndex} keypresses={session.keypresses} />
          </div>

          {/* Progress bar */}
          <div className="mt-3 w-full h-1 bg-bg-elevated rounded-full overflow-hidden">
            <div
              className="h-1 bg-brutal-mint rounded-full transition-all duration-200"
              style={{ width: `${session.progress * 100}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
}
