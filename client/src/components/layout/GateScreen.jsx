/** @fileoverview Full-screen daily typing gate with countdown timer and typing test */
import { useState, useCallback, useEffect } from 'react';
import { Zap, SkipForward, X } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useAppStore from '../../store/useAppStore';
import useTypingSession from '../../hooks/useTypingSession';
import { saveSession } from '../../api/typing';
import { addXP } from '../../api/progress';
import { updateProfile } from '../../api/auth';
import { formatTime, getTodayString, getGateDayMode } from '../../utils/dateUtils';
import { getFingerForKey, FINGER_NAMES } from '../../utils/fingerMap';
import { TYPING_LEVELS } from '../../utils/typingGeminiPrompt';

const GATE_TEXTS = {
  words: 'rain lane liar lean earn rein line nail alien liner arena inner aerial renal liner alien lane rain nail earn lean rein liar line arena inner aerial renal liner alien lane rain nail earn lean rein liar line arena inner',
  code: 'function add(a, b) { return a + b; } const result = add(5, 3); console.log(result); if (result > 0) { print("positive"); } else { print("negative"); }',
  sentences: 'Practice makes perfect. Every expert was once a beginner. The journey of a thousand miles begins with a single step. Code is poetry written for machines to execute and humans to understand.',
};

function getGateText(mode, lessonLevel) {
  if (lessonLevel <= 1) return 'asdf jkl; asdf jkl; asdf asdf jkl; jkl; asdf jkl; fjdk slaj fdks lajf dksl ajfd ksla jfdk slaj';
  if (lessonLevel <= 2) return 'add fall lads salad flask jails glad dash flags shall half glass jazz';
  if (lessonLevel <= 5) return GATE_TEXTS[mode] || GATE_TEXTS.words;
  return GATE_TEXTS[mode] || GATE_TEXTS.words;
}

export default function GateScreen({ onComplete }) {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [resultData, setResultData] = useState(null);

  const durationSecs = (user?.gateDurationMinutes || 5) * 60;
  const mode = getGateDayMode();
  const text = getGateText(mode, user?.level || 1);

  const handleComplete = useCallback(async (data) => {
    setResultData(data);
    setShowResults(true);

    try {
      await saveSession({
        date: getTodayString(),
        mode,
        durationSecs: data.durationSecs,
        wpm: data.wpm,
        accuracy: data.accuracy,
        isGate: true,
        wasSkipped: false,
        keypresses: data.keypresses,
        backspaces: data.backspaces,
      });

      await addXP('gate_complete', 50);
      await updateProfile({ lastGateDate: getTodayString() });
      updateUser({ lastGateDate: getTodayString() });
    } catch (e) {
      console.error('Gate save error:', e);
    }

    setTimeout(() => {
      if (onComplete) onComplete();
    }, 3000);
  }, [mode, onComplete, updateUser]);

  const session = useTypingSession({ text, duration: durationSecs, onComplete: handleComplete });

  useEffect(() => {
    if (!session.isActive && !session.isComplete) {
      session.startSession();
    }
  }, []);

  const handleSkip = async () => {
    try {
      await updateProfile({
        lastGateDate: getTodayString(),
        gateSkipCount: (user?.gateSkipCount || 0) + 1,
      });
      updateUser({
        lastGateDate: getTodayString(),
        gateSkipCount: (user?.gateSkipCount || 0) + 1,
      });
    } catch (e) {
      console.error('Gate skip error:', e);
    }
    if (onComplete) onComplete();
  };

  const nextKey = text[session.currentIndex] || '';
  const fingerInfo = getFingerForKey(nextKey);

  if (showResults && resultData) {
    return (
      <div className="fixed inset-0 bg-bg-primary z-50 flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <Zap className="w-16 h-16 text-brutal-mint mx-auto mb-4 animate-pulse" />
          <h2 className="text-3xl font-heading font-bold text-text-primary mb-4">Gate Complete!</h2>
          <div className="flex gap-8 justify-center">
            <div>
              <p className="text-3xl font-mono text-brutal-mint">{resultData.wpm}</p>
              <p className="text-xs text-text-muted">WPM</p>
            </div>
            <div>
              <p className="text-3xl font-mono text-brutal-yellow">{resultData.accuracy}%</p>
              <p className="text-xs text-text-muted">Accuracy</p>
            </div>
            <div>
              <p className="text-3xl font-mono text-brutal-purple">+50</p>
              <p className="text-xs text-text-muted">XP</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-bg-primary z-50 flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Header */}
      <div className="text-center mb-6">
        <Zap className="w-10 h-10 text-brutal-mint mx-auto mb-2" />
        <h1 className="text-xl font-heading font-bold text-text-primary">Daily Training Gate</h1>
        <span className="text-xs text-text-muted uppercase tracking-wider">{mode} mode</span>
      </div>

      {/* Timer */}
      <div className="text-4xl font-mono text-brutal-mint mb-6 animate-pulse">
        {formatTime(session.timeLeft)}
      </div>

      {/* Typing area */}
      <div className="max-w-2xl w-full bg-bg-card border-2 border-brutal-black rounded-lg shadow-brutal-md p-6 mb-4 overflow-hidden">
        <div className="font-mono text-base leading-loose select-none break-words w-full">
          {text.split('').map((char, i) => {
            let className = 'text-text-muted';
            if (i < session.currentIndex) {
              const kp = session.keypresses[i];
              className = kp?.isCorrect !== false ? 'text-correct' : 'text-incorrect bg-incorrect-bg';
            } else if (i === session.currentIndex) {
              className = 'text-text-primary bg-brutal-yellow border-b-[3px] border-brutal-black';
            }
            return <span key={i} className={className}>{char === ' ' ? '\u00A0' : char}</span>;
          })}
        </div>
      </div>

      {/* Live stats */}
      <div className="flex gap-8 mb-4 text-sm">
        <div><span className="text-text-muted">WPM</span> <span className="font-mono text-brutal-mint ml-1">{session.wpm}</span></div>
        <div><span className="text-text-muted">Accuracy</span> <span className="font-mono text-brutal-yellow ml-1">{session.accuracy}%</span></div>
        <div><span className="text-text-muted">Chars</span> <span className="font-mono text-text-secondary ml-1">{session.currentIndex}/{text.length}</span></div>
      </div>

      {/* Finger hint */}
      <div className="text-sm text-text-muted mb-6">
        {nextKey && (
          <span>Next: <span className="text-brutal-mint font-mono">{nextKey === ' ' ? 'SPACE' : nextKey}</span> — USE: {FINGER_NAMES[fingerInfo.finger] || fingerInfo.finger}</span>
        )}
      </div>

      {/* Skip button */}
      <button
        onClick={() => setShowSkipConfirm(true)}
        className="text-text-muted text-xs hover:text-text-secondary transition-colors flex items-center gap-1"
      >
        <SkipForward size={12} /> Skip gate
      </button>

      {/* Skip confirmation modal */}
      {showSkipConfirm && (
        <div className="fixed inset-0 bg-overlay flex items-center justify-center z-50">
          <div className="bg-bg-card border-2 border-brutal-black rounded-lg shadow-brutal-md p-6 max-w-sm">
            <h3 className="text-text-primary font-heading mb-2">Are you sure?</h3>
            <p className="text-text-secondary text-sm mb-4">Typing practice is what builds speed. Skip anyway?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSkipConfirm(false)}
                className="flex-1 px-4 py-2 border-2 border-brutal-black rounded-lg text-text-secondary text-sm hover:bg-bg-elevated"
              >
                Keep typing
              </button>
              <button
                onClick={handleSkip}
                className="flex-1 px-4 py-2 bg-brutal-coral text-text-primary border-2 border-brutal-black rounded-lg text-sm shadow-brutal-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
