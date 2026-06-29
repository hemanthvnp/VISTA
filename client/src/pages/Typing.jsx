/** @fileoverview Typing page with 5 tabs - Practice, Lessons, Stats, ML Analysis, Finger Guide */
import { useState, useEffect, useCallback } from 'react';
import useTypingStore from '../store/useTypingStore';
import useAuthStore from '../store/useAuthStore';
import { saveSession, getSessions, getStats } from '../api/typing';
import { addXP } from '../api/progress';
import TypingEngine from '../components/typing/TypingEngine';
import LiveKeyboard from '../components/typing/LiveKeyboard';
import LessonDrill from '../components/typing/LessonDrill';
import DrillCard from '../components/typing/DrillCard';
import KeyboardHeatmap from '../components/typing/KeyboardHeatmap';
import WPMProjectionChart from '../components/typing/WPMProjectionChart';
import FingerDiagram from '../components/typing/FingerDiagram';
import MlAnalysisPanel from '../components/typing/MlAnalysisPanel';
import BrutalCard from '../components/ui/BrutalCard';
import { TYPING_LEVELS } from '../utils/typingGeminiPrompt';
import { getTodayString } from '../utils/dateUtils';
import { Keyboard, BookOpen, BarChart3, Brain, Hand, ChevronDown, ChevronRight, Play, Lock } from 'lucide-react';

const TABS = [
  { id: 'practice', label: 'Practice', icon: Keyboard },
  { id: 'lessons', label: 'Lessons', icon: BookOpen },
  { id: 'stats', label: 'Stats', icon: BarChart3 },
  { id: 'ml', label: 'ML Analysis', icon: Brain },
  { id: 'guide', label: 'Finger Guide', icon: Hand },
];

const MODES = ['words', 'code', 'sentences'];
const DURATIONS = [60, 180, 300, 600];

const PRACTICE_TEXTS = {
  words: 'rain lane liar lean earn rein line nail alien liner arena inner aerial renal liner alien lane rain nail earn lean rein liar line arena inner aerial renal liner alien lane rain nail earn lean rein liar line arena inner',
  code: 'function fibonacci(n) { if (n <= 1) return n; return fibonacci(n - 1) + fibonacci(n - 2); } const result = fibonacci(10); console.log("Result:", result);',
  sentences: 'Practice makes perfect. Every expert was once a beginner. The journey of a thousand miles begins with a single step. Code is poetry written for machines to execute.',
};

export default function Typing() {
  const [tab, setTab] = useState('practice');
  const [mode, setMode] = useState('words');
  const [duration, setDuration] = useState(60);
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState(null);
  const { mlReport, geminiAdvice } = useTypingStore();

  // Lesson state
  const [expandedLevel, setExpandedLevel] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null); // { level, lessonIndex }

  const handleLessonBack = () => setActiveLesson(null);
  const handleLessonNext = () => {
    if (!activeLesson) return;
    const { level, lessonIndex } = activeLesson;
    const nextIndex = lessonIndex + 1;
    if (nextIndex < level.lessons.length) {
      setActiveLesson({ level, lessonIndex: nextIndex });
    } else {
      setActiveLesson(null);
    }
  };

  const LEVEL_COLORS = [
    'border-2 border-brutal-black text-brutal-mint',
    'border-2 border-brutal-black text-brutal-mint',
    'border-2 border-brutal-black text-brutal-blue',
    'border-2 border-brutal-black text-brutal-blue',
    'border-2 border-brutal-black text-brutal-yellow',
    'border-2 border-brutal-black text-brutal-yellow',
    'border-2 border-brutal-black text-brutal-purple',
    'border-2 border-brutal-black text-brutal-purple',
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const [s, st] = await Promise.all([getSessions(), getStats()]);
        setSessions(s.sessions || s || []);
        setStats(st);
      } catch (e) {
        console.error('Typing data load error:', e);
      }
    };
    load();
  }, []);

  const handleSessionComplete = useCallback(async (data) => {
    try {
      await saveSession({
        date: getTodayString(),
        mode,
        durationSecs: data.durationSecs,
        wpm: data.wpm,
        accuracy: data.accuracy,
        isGate: false,
        wasSkipped: false,
        keypresses: data.keypresses,
        backspaces: data.backspaces,
      });
      await addXP('voluntary_session', 20);
    } catch (e) {
      console.error('Session save error:', e);
    }
  }, [mode]);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 bg-bg-card rounded-lg p-1 border-2 border-brutal-black">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${tab === id
              ? 'bg-brutal-yellow text-text-primary border-2 border-brutal-black font-semibold'
              : 'text-text-muted hover:text-text-secondary'
              }`}
          >
            <Icon size={16} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Practice Tab */}
      {tab === 'practice' && (
        <div className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            {/* Mode selector */}
            <div className="flex gap-1 bg-bg-card rounded-lg p-1 border-2 border-brutal-black">
              {MODES.map((m) => (
                <button key={m} onClick={() => setMode(m)}
                  className={`px-3 py-1.5 rounded text-xs capitalize ${mode === m ? 'bg-brutal-yellow text-text-primary border-2 border-brutal-black font-semibold' : 'text-text-muted'}`}
                >{m}</button>
              ))}
            </div>
            {/* Duration selector */}
            <div className="flex gap-1 bg-bg-card rounded-lg p-1 border-2 border-brutal-black">
              {DURATIONS.map((d) => (
                <button key={d} onClick={() => setDuration(d)}
                  className={`px-3 py-1.5 rounded text-xs ${duration === d ? 'bg-brutal-yellow text-text-primary border-2 border-brutal-black font-semibold' : 'text-text-muted'}`}
                >{d / 60}m</button>
              ))}
            </div>
          </div>

          <TypingEngine
            text={PRACTICE_TEXTS[mode] || PRACTICE_TEXTS.words}
            duration={duration}
            mode={mode}
            onSessionComplete={handleSessionComplete}
          />

          <LiveKeyboard nextKey="" />
        </div>
      )}

      {/* Lessons Tab */}
      {tab === 'lessons' && (
        activeLesson ? (
          <LessonDrill
            level={activeLesson.level}
            lesson={activeLesson.level.lessons[activeLesson.lessonIndex]}
            lessonIndex={activeLesson.lessonIndex}
            onBack={handleLessonBack}
            onNext={handleLessonNext}
            hasNext={activeLesson.lessonIndex + 1 < activeLesson.level.lessons.length}
          />
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-heading text-text-primary">8-Level Typing Curriculum</h2>
              <span className="text-xs text-text-muted">{TYPING_LEVELS.reduce((a, l) => a + l.lessons.length, 0)} lessons total</span>
            </div>
            {TYPING_LEVELS.map((level, levelIdx) => {
              const colorClass = LEVEL_COLORS[levelIdx] || LEVEL_COLORS[0];
              const isExpanded = expandedLevel === levelIdx;
              return (
                <div key={level.id} className="rounded-lg border-2 border-brutal-black overflow-hidden">
                  {/* Level header */}
                  <button
                    onClick={() => setExpandedLevel(isExpanded ? null : levelIdx)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-bg-card hover:bg-bg-elevated transition-colors text-left"
                  >
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${colorClass}`}>
                      {level.id}
                    </span>
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-text-primary">{level.name}</span>
                      <span className="text-xs text-text-muted ml-2">· {level.wpmTarget} WPM · {level.lessons.length} lessons</span>
                    </div>
                    <span className="font-mono text-xs text-text-muted tracking-widest hidden sm:block">{level.keys}</span>
                    {isExpanded
                      ? <ChevronDown size={16} className="text-text-muted shrink-0" />
                      : <ChevronRight size={16} className="text-text-muted shrink-0" />
                    }
                  </button>
                  {/* Sub-lessons */}
                  {isExpanded && (
                    <div className="divide-y divide-brutal-black/50 border-t border-brutal-black">
                      {level.lessons.map((lesson, lessonIdx) => (
                        <button
                          key={lesson.id}
                          onClick={() => setActiveLesson({ level, lessonIndex: lessonIdx })}
                          className="w-full flex items-center gap-3 px-5 py-3 bg-bg-primary hover:bg-bg-elevated transition-colors text-left group"
                        >
                          <div className="w-6 h-6 rounded-full border-2 border-brutal-black bg-bg-elevated flex items-center justify-center shrink-0 group-hover:border-brutal-mint transition-colors">
                            <Play size={10} className="text-text-muted group-hover:text-brutal-mint transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-text-primary group-hover:text-brutal-mint transition-colors">{lesson.title}</p>
                            <p className="text-xs text-text-muted truncate mt-0.5 font-mono">{lesson.text.slice(0, 60)}{lesson.text.length > 60 ? '…' : ''}</p>
                          </div>
                          <span className="text-xs text-brutal-yellow opacity-0 group-hover:opacity-100 transition-opacity shrink-0">+75 XP</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Stats Tab */}
      {tab === 'stats' && (
        <div className="space-y-4">
          <BrutalCard>
            <h3 className="text-sm text-text-secondary mb-3">WPM Over Time</h3>
            <WPMProjectionChart sessions={sessions.slice(-30)} />
          </BrutalCard>
          <BrutalCard>
            <h3 className="text-sm text-text-secondary mb-3">Keyboard Heatmap</h3>
            <KeyboardHeatmap keyStats={{}} />
          </BrutalCard>
          {sessions.length > 0 && (
            <BrutalCard>
              <h3 className="text-sm text-text-secondary mb-3">Recent Sessions</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-text-muted border-b border-brutal-black">
                      <th className="text-left py-2">Date</th>
                      <th className="text-left py-2">Mode</th>
                      <th className="text-right py-2">WPM</th>
                      <th className="text-right py-2">Accuracy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.slice(-20).reverse().map((s, i) => (
                      <tr key={i} className="border-b border-brutal-black/50">
                        <td className="py-2 text-text-secondary">{s.date}</td>
                        <td className="py-2 text-text-secondary capitalize">{s.mode}</td>
                        <td className="py-2 text-right font-mono text-brutal-mint">{s.wpm}</td>
                        <td className="py-2 text-right font-mono text-brutal-yellow">{s.accuracy}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </BrutalCard>
          )}
        </div>
      )}

      {/* ML Analysis Tab */}
      {tab === 'ml' && <MlAnalysisPanel />}

      {/* Finger Guide Tab */}
      {tab === 'guide' && (
        <BrutalCard>
          <FingerDiagram />
        </BrutalCard>
      )}
    </div>
  );
}
