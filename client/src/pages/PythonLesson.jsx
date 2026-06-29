/** @fileoverview Interactive Python lesson page — theory, runnable code, and challenge */
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import usePyodide from '../hooks/usePyodide';
import useTheme from '../hooks/useTheme';
import { addXP, getProgress, updateProgress, refreshUser, reviewPythonChallenge } from '../api/progress';
import { PYTHON_TOPICS, TOPIC_COLOR_CLASSES } from '../utils/pythonCurriculum';
import useAuthStore from '../store/useAuthStore';
import BrutalCard from '../components/ui/BrutalCard';
import {
    ArrowLeft, ArrowRight, BookOpen, Code2, Zap, CheckCircle,
    Play, RotateCcw, ChevronRight, Trophy, Lightbulb, Sparkles, Loader2
} from 'lucide-react';

/* ── Inline markdown renderer (same as ChatMessage) ── */
function InlineMd({ text }) {
    const parts = [];
    const re = /(\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`)/g;
    let last = 0, m;
    while ((m = re.exec(text)) !== null) {
        if (m.index > last) parts.push(<span key={last}>{text.slice(last, m.index)}</span>);
        if (m[2]) parts.push(<strong key={m.index} className="text-text-primary font-semibold">{m[2]}</strong>);
        else if (m[3]) parts.push(<em key={m.index} className="italic text-text-secondary">{m[3]}</em>);
        else if (m[4]) parts.push(<code key={m.index} className="bg-bg-elevated text-brutal-mint text-xs px-1.5 py-0.5 rounded font-mono">{m[4]}</code>);
        last = m.index + m[0].length;
    }
    if (last < text.length) parts.push(<span key={last}>{text.slice(last)}</span>);
    return <>{parts}</>;
}

function TheoryBlock({ content }) {
    const lines = content.split('\n');
    const nodes = [];
    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        if (line.startsWith('```')) {
            const codeLines = [];
            i++;
            while (i < lines.length && !lines[i].startsWith('```')) { codeLines.push(lines[i]); i++; }
            nodes.push(
                <pre key={i} className="bg-bg-elevated border-2 border-brutal-black rounded-lg p-4 my-3 overflow-x-auto text-sm font-mono text-text-secondary leading-relaxed">
                    <code>{codeLines.join('\n')}</code>
                </pre>
            );
            i++; continue;
        }
        if (/^#{1,3} /.test(line)) {
            const lvl = line.match(/^(#+)/)[1].length;
            const txt = line.replace(/^#+\s/, '');
            const cls = lvl === 1
                ? 'text-lg font-bold text-text-primary mt-5 mb-2'
                : lvl === 2 ? 'text-base font-semibold text-text-primary mt-4 mb-1.5'
                    : 'text-sm font-semibold text-text-secondary mt-3 mb-1';
            nodes.push(<div key={i} className={cls}><InlineMd text={txt} /></div>);
            i++; continue;
        }
        if (/^\|/.test(line)) {
            const tableLines = [];
            while (i < lines.length && /^\|/.test(lines[i])) { tableLines.push(lines[i]); i++; }
            const headers = tableLines[0].split('|').filter(Boolean).map(h => h.trim());
            const rows = tableLines.slice(2).map(r => r.split('|').filter(Boolean).map(c => c.trim()));
            nodes.push(
                <table key={i} className="w-full text-sm my-3 border-collapse">
                    <thead>
                        <tr>{headers.map((h, j) => <th key={j} className="text-left px-3 py-1.5 border-b border-brutal-black text-text-secondary font-medium text-xs">{h}</th>)}</tr>
                    </thead>
                    <tbody>
                        {rows.map((row, ri) => (
                            <tr key={ri} className="border-b border-brutal-black/30">
                                {row.map((cell, ci) => <td key={ci} className="px-3 py-1.5 text-text-secondary text-xs"><InlineMd text={cell} /></td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
            continue;
        }
        if (/^[\-\*] /.test(line)) {
            nodes.push(
                <div key={i} className="flex gap-2 my-0.5 text-sm">
                    <span className="text-brutal-mint mt-1 shrink-0">•</span>
                    <span className="text-text-secondary"><InlineMd text={line.slice(2)} /></span>
                </div>
            );
            i++; continue;
        }
        if (line.trim() === '') { nodes.push(<div key={i} className="h-2" />); i++; continue; }
        nodes.push(<p key={i} className="text-sm text-text-secondary leading-relaxed"><InlineMd text={line} /></p>);
        i++;
    }
    return <div className="space-y-1">{nodes}</div>;
}

/* ── Section Tab Labels ── */
const SECTION_ICONS = { theory: BookOpen, code: Code2, challenge: Zap };
const SECTION_LABELS = { theory: 'Theory', code: 'Code', challenge: 'Challenge' };

export default function PythonLesson() {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const { runPython, loading: pyLoading } = usePyodide();
    const { resolvedTheme } = useTheme();
    const { user, updateUser } = useAuthStore();

    const topicIdx = PYTHON_TOPICS.findIndex(t => t.id === topicId);
    const topic = PYTHON_TOPICS[topicIdx];

    const [activeSection, setActiveSection] = useState(0);
    const [codeValue, setCodeValue] = useState('');
    const [output, setOutput] = useState('');
    const [outputError, setOutputError] = useState('');
    const [hasRun, setHasRun] = useState(false);  // keeps output panel visible
    const [running, setRunning] = useState(false);
    const [challengePassed, setChallengePassed] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [alreadyDone, setAlreadyDone] = useState(false);
    const [xpAwarded, setXpAwarded] = useState(false);

    // AI code review
    const [aiReview, setAiReview] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [showAiReview, setShowAiReview] = useState(false);

    const section = topic?.sections[activeSection];
    const colors = topic ? (TOPIC_COLOR_CLASSES[topic.color] || TOPIC_COLOR_CLASSES.cyan) : TOPIC_COLOR_CLASSES.cyan;

    // Check if already completed — dep on topicId (primitive) not topic (object ref)
    useEffect(() => {
        if (!topic) return;
        getProgress().then(p => {
            // Mongoose Maps serialize as plain objects — check both direct key and .get()
            const lp = p?.lessonProgress || {};
            const key = `python-${topic.id}`;
            const done = lp[key] === true || (typeof lp.get === 'function' && lp.get(key));
            if (done) {
                setAlreadyDone(true);
                setChallengePassed(true);
            }
        }).catch(() => { });
    }, [topicId]); // topicId is a string — stable

    // Set editor code when section changes — dep on primitives, NOT section object ref
    // Using [topicId, activeSection] prevents this firing on every render
    useEffect(() => {
        const sec = topic?.sections[activeSection];
        if (!sec) return;
        if (sec.type === 'code') setCodeValue(sec.code || '');
        else if (sec.type === 'challenge') setCodeValue(sec.starterCode || '');
        setOutput('');
        setOutputError('');
        setHasRun(false);
        setShowHint(false);
        setAiReview('');
        setShowAiReview(false);
    }, [topicId, activeSection]); // eslint-disable-line react-hooks/exhaustive-deps

    /** Bump streak by 1 if we haven't already logged today */
    const bumpStreak = useCallback(async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const currentStreak = user?.streak || { count: 0, lastDate: '', type: '', bestEver: 0 };
            if (currentStreak.lastDate === today) return; // already counted today
            const newCount = currentStreak.lastDate
                ? (() => {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    const yStr = yesterday.toISOString().split('T')[0];
                    return currentStreak.lastDate === yStr ? currentStreak.count + 1 : 1;
                })()
                : 1;
            const newStreak = {
                count: newCount,
                lastDate: today,
                type: 'learning',
                bestEver: Math.max(newCount, currentStreak.bestEver || 0),
            };
            const token = localStorage.getItem('vanta_token');
            await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ streak: newStreak }),
            });
        } catch { }
    }, [user]);

    const handleRun = useCallback(async () => {
        if (!codeValue.trim()) return;
        // Capture section at call time to avoid stale closure
        const currentSection = topic?.sections[activeSection];
        setRunning(true);
        setHasRun(true);
        setOutput('');
        setOutputError('');
        // Reset AI review when re-running
        setAiReview('');
        setShowAiReview(false);
        try {
            const result = await runPython(codeValue);
            const out = result.output || '';
            const err = result.error || '';
            setOutput(out);
            if (err) setOutputError(err);

            // Auto-check challenge
            if (currentSection?.type === 'challenge' && currentSection.check && !challengePassed) {
                const passed = currentSection.check(out + err);
                if (passed) {
                    setChallengePassed(true);
                    if (!alreadyDone) {
                        setXpAwarded(true);
                        try {
                            await Promise.all([
                                addXP(`python-${topic.id}`, topic.xp),
                                updateProgress({ lessonProgress: { [`python-${topic.id}`]: true } }),
                                bumpStreak(),
                            ]);
                            setAlreadyDone(true);
                            // Refresh auth store so Dashboard XP + streak update immediately
                            const freshUser = await refreshUser();
                            updateUser(freshUser);
                        } catch (e) {
                            console.error('XP/progress update error:', e);
                        }
                    }
                }
            }
        } catch (e) {
            setOutputError(e.message);
        } finally {
            setRunning(false);
        }
    }, [codeValue, activeSection, topic, challengePassed, alreadyDone, runPython, bumpStreak, updateUser]);

    const handleAiReview = useCallback(async () => {
        if (aiLoading) return;
        setAiLoading(true);
        setShowAiReview(true);
        try {
            const data = await reviewPythonChallenge({
                code: codeValue,
                challengeTitle: section?.title || topic?.title,
                instructions: section?.instructions || '',
            });
            setAiReview(data.review || 'No feedback available.');
        } catch (e) {
            setAiReview('Could not get AI feedback right now. Please try again.');
        } finally {
            setAiLoading(false);
        }
    }, [aiLoading, codeValue, section, topic]);

    const handleReset = () => {
        const currentSection = topic?.sections[activeSection];
        if (currentSection?.type === 'code') setCodeValue(currentSection.code);
        else if (currentSection?.type === 'challenge') setCodeValue(currentSection.starterCode);
        setOutput('');
        setOutputError('');
        setHasRun(false);
    };

    if (!topic) {
        return (
            <div className="text-center py-20">
                <p className="text-text-muted">Topic not found.</p>
                <button onClick={() => navigate('/python')} className="btn-brutal text-sm mt-4 px-4 py-2">← Back to Python</button>
            </div>
        );
    }

    const prevTopic = PYTHON_TOPICS[topicIdx - 1];
    const nextTopic = PYTHON_TOPICS[topicIdx + 1];

    return (
        <div className="space-y-4">
            {/* Top nav */}
            <div className="flex items-center justify-between">
                <button onClick={() => navigate('/python')} className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-brutal-mint transition-colors">
                    <ArrowLeft size={16} /> Back to Python
                </button>
                <div className="flex items-center gap-2">
                    {prevTopic && (
                        <button onClick={() => navigate(`/python/${prevTopic.id}`)}
                            className="px-3 py-1.5 text-xs border-2 border-brutal-black rounded-lg text-text-muted hover:text-text-primary hover:border-brutal-black flex items-center gap-1">
                            <ArrowLeft size={12} /> {prevTopic.title}
                        </button>
                    )}
                    {nextTopic && (
                        <button onClick={() => navigate(`/python/${nextTopic.id}`)}
                            className="px-3 py-1.5 text-xs border-2 border-brutal-black rounded-lg text-text-muted hover:text-text-primary hover:border-brutal-black flex items-center gap-1">
                            {nextTopic.title} <ArrowRight size={12} />
                        </button>
                    )}
                </div>
            </div>

            {/* Header */}
            <div className="flex items-center gap-4">
                <span className="text-3xl">{topic.icon}</span>
                <div className="flex-1">
                    <h1 className="text-xl font-heading text-text-primary">{topic.title}</h1>
                    <p className="text-sm text-text-muted">{topic.description}</p>
                </div>
                <div className={`flex items-center gap-1.5 font-mono text-sm ${colors.badge}`}>
                    <Zap size={14} /> {topic.xp} XP
                    {(alreadyDone || challengePassed) && <CheckCircle size={14} className="text-brutal-mint ml-1" />}
                </div>
            </div>

            {/* Section Tabs */}
            <div className="flex gap-2 border-b border-brutal-black">
                {topic.sections.map((sec, idx) => {
                    const Icon = SECTION_ICONS[sec.type];
                    const active = idx === activeSection;
                    return (
                        <button key={idx} onClick={() => setActiveSection(idx)}
                            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors -mb-px ${active
                                ? 'bg-brutal-yellow text-text-primary border-2 border-brutal-black font-semibold rounded-t-lg'
                                : 'border-b-2 border-transparent text-text-muted hover:text-text-secondary'
                                }`}>
                            <Icon size={14} />
                            {SECTION_LABELS[sec.type]}
                            {sec.type === 'challenge' && challengePassed && <CheckCircle size={12} className="text-brutal-mint" />}
                        </button>
                    );
                })}
            </div>

            {/* Section Content */}
            {section?.type === 'theory' && (
                <BrutalCard>
                    <h2 className="text-base font-heading text-text-primary mb-4">{section.title}</h2>
                    <TheoryBlock content={section.content} />
                    <div className="mt-6 flex justify-end">
                        <button onClick={() => setActiveSection(activeSection + 1)} className="btn-brutal text-sm px-4 py-2 flex items-center gap-2">
                            Next: Code Example <ChevronRight size={14} />
                        </button>
                    </div>
                </BrutalCard>
            )}

            {(section?.type === 'code' || section?.type === 'challenge') && (
                <div className="space-y-4">
                    {section.type === 'challenge' && (
                        <BrutalCard color="purple">
                            <h2 className="text-sm font-heading text-brutal-purple mb-2 flex items-center gap-2">
                                <Zap size={14} /> {section.title}
                            </h2>
                            <TheoryBlock content={section.instructions} />
                            {showHint && (
                                <div className="mt-3 p-3 bg-brutal-yellow/10 border border-brutal-yellow/30 rounded-lg text-xs text-brutal-yellow">
                                    💡 {section.hint}
                                </div>
                            )}
                            {!showHint && (
                                <button onClick={() => setShowHint(true)} className="mt-3 text-xs text-text-muted hover:text-brutal-yellow flex items-center gap-1">
                                    <Lightbulb size={12} /> Show hint
                                </button>
                            )}
                        </BrutalCard>
                    )}

                    <BrutalCard className="p-0 overflow-hidden">
                        {/* Editor Toolbar */}
                        <div className="flex items-center justify-between px-4 py-2 bg-bg-elevated border-b border-brutal-black">
                            <span className="text-xs font-mono text-brutal-mint">{section.type === 'challenge' ? 'Your Code' : 'main.py'}</span>
                            <div className="flex gap-2">
                                <button onClick={handleReset} className="text-xs text-text-muted hover:text-text-secondary flex items-center gap-1">
                                    <RotateCcw size={11} /> Reset
                                </button>
                                <button
                                    onClick={handleRun}
                                    disabled={running || pyLoading}
                                    className="btn-brutal text-xs px-3 py-1 flex items-center gap-1.5 disabled:opacity-50"
                                >
                                    <Play size={11} />
                                    {running || pyLoading ? 'Running...' : 'Run Python'}
                                </button>
                            </div>
                        </div>

                        {/* Monaco Editor */}
                        <Editor
                            height="280px"
                            language="python"
                            value={codeValue}
                            onChange={setCodeValue}
                            theme={resolvedTheme === 'dark' ? 'vs-dark' : 'vs'}
                            options={{
                                fontSize: 13,
                                fontFamily: "'JetBrains Mono', monospace",
                                minimap: { enabled: false },
                                lineNumbers: 'on',
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                padding: { top: 10 },
                            }}
                        />
                    </BrutalCard>

                    {/* Output Panel — stays visible once code has run */}
                    {(hasRun || running || pyLoading) && (
                        <BrutalCard className="p-0 overflow-hidden">
                            <div className="px-4 py-2 bg-bg-elevated border-b-2 border-brutal-black text-xs text-text-muted flex items-center justify-between">
                                <span className="font-mono">Output</span>
                                {challengePassed && (
                                    <span className="text-brutal-mint flex items-center gap-1 font-semibold">
                                        <CheckCircle size={12} /> Challenge Passed!
                                    </span>
                                )}
                                {outputError && !challengePassed && (
                                    <span className="text-red-400 text-xs">Error in your code</span>
                                )}
                            </div>
                            <div className="p-4 font-mono text-sm min-h-[60px] max-h-48 overflow-y-auto sidebar-scroll">
                                {(running || pyLoading) && <p className="text-text-muted animate-pulse">Running...</p>}
                                {outputError && <pre className="text-red-400 whitespace-pre-wrap">{outputError}</pre>}
                                {output && <pre className="text-brutal-mint whitespace-pre-wrap">{output}</pre>}
                            </div>
                        </BrutalCard>
                    )}

                    {/* AI Code Review — on-demand, shown for challenge section after run */}
                    {section.type === 'challenge' && hasRun && (
                        <div className="space-y-2">
                            {!showAiReview ? (
                                <button
                                    onClick={handleAiReview}
                                    disabled={aiLoading}
                                    className="flex items-center gap-2 px-4 py-2 border-2 border-brutal-black bg-bg-elevated shadow-[3px_3px_0px_#1A1A1A] text-sm font-semibold hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-150 disabled:opacity-50"
                                >
                                    <Sparkles size={14} className="text-brutal-purple" />
                                    Get AI Feedback
                                </button>
                            ) : (
                                <BrutalCard className="p-0 overflow-hidden">
                                    <div className="px-4 py-2 bg-brutal-purple/10 border-b-2 border-brutal-black text-xs flex items-center gap-2 text-brutal-purple font-semibold">
                                        <Sparkles size={12} /> AI Code Review
                                    </div>
                                    <div className="p-4 text-sm text-text-secondary leading-relaxed">
                                        {aiLoading ? (
                                            <span className="flex items-center gap-2 text-text-muted">
                                                <Loader2 size={14} className="animate-spin" /> Analysing your code...
                                            </span>
                                        ) : (
                                            <p>{aiReview}</p>
                                        )}
                                    </div>
                                    {!aiLoading && (
                                        <button
                                            onClick={() => { setShowAiReview(false); setAiReview(''); }}
                                            className="px-4 py-2 text-xs text-text-muted hover:text-text-secondary border-t-2 border-brutal-black w-full text-left"
                                        >
                                            Dismiss
                                        </button>
                                    )}
                                </BrutalCard>
                            )}
                        </div>
                    )}

                    {/* XP celebration + Next Lesson — shown whenever challenge is passed */}
                    {(xpAwarded || (challengePassed && alreadyDone)) && (
                        <div className="flex items-center gap-3 p-4 bg-bg-card border-2 border-brutal-black shadow-[4px_4px_0px_#1A1A1A]">
                            <Trophy size={20} className="text-brutal-yellow shrink-0" />
                            <div>
                                {xpAwarded
                                    ? <p className="text-sm font-semibold text-brutal-mint">Challenge Complete! +{topic.xp} XP 🎉</p>
                                    : <p className="text-sm font-semibold text-brutal-mint">Already completed ✓</p>
                                }
                                <p className="text-xs text-text-secondary mt-0.5">
                                    {nextTopic ? `Next up: ${nextTopic.title}` : "🏆 You've completed all Python topics!"}
                                </p>
                            </div>
                            {nextTopic && (
                                <button
                                    onClick={() => navigate(`/python/${nextTopic.id}`)}
                                    className="ml-auto px-4 py-2 bg-brutal-yellow border-2 border-brutal-black shadow-[3px_3px_0px_#1A1A1A] text-xs font-bold hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-150 flex items-center gap-1"
                                >
                                    Next Lesson <ArrowRight size={12} />
                                </button>
                            )}
                        </div>
                    )}

                    {/* Nav between sections */}
                    {section.type === 'code' && (
                        <div className="flex justify-between">
                            <button onClick={() => setActiveSection(activeSection - 1)} className="text-sm text-text-muted hover:text-text-secondary flex items-center gap-1">
                                <ArrowLeft size={14} /> Theory
                            </button>
                            <button onClick={() => setActiveSection(activeSection + 1)} className="btn-brutal text-sm px-4 py-2 flex items-center gap-2">
                                Try the Challenge <ChevronRight size={14} />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
