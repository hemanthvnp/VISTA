/** @fileoverview Learn hub — all 10 tech category cards */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProgress } from '../api/progress';
import { ALL_TECHS, LAYER_COLORS } from '../utils/learnCurriculum';
import { CheckCircle, Lock, ChevronRight, Zap, BookOpen } from 'lucide-react';

function CompletionRing({ pct = 0, color = '#88D8B0', size = 44 }) {
    const r = (size - 6) / 2;
    const circ = 2 * Math.PI * r;
    const dash = (pct / 100) * circ;
    return (
        <svg width={size} height={size} className="rotate-[-90deg]">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-ring-track)" strokeWidth={4} />
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={4}
                strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.6s ease' }} />
        </svg>
    );
}

const RING_COLORS = { cyan: '#88D8B0', purple: '#8338EC', gold: '#FFBE0B', orange: '#FB5607', magenta: '#FF006E' };
const BORDER_CLASSES = {
    cyan: 'border-2 border-brutal-black hover:shadow-brutal-sm',
    purple: 'border-2 border-brutal-black hover:shadow-brutal-sm',
    gold: 'border-2 border-brutal-black hover:shadow-brutal-sm',
    orange: 'border-2 border-brutal-black hover:shadow-brutal-sm',
};

export default function LearnHub() {
    const navigate = useNavigate();
    const [completed, setCompleted] = useState({});

    useEffect(() => {
        getProgress().then(p => setCompleted(p?.lessonProgress || {})).catch(() => { });
    }, []);

    const totalTopics = ALL_TECHS.reduce((s, t) => s + t.topics.length, 0);
    const totalXP = ALL_TECHS.reduce((s, t) => s + t.topics.reduce((a, top) => a + top.xp, 0), 0);

    const earnedXP = ALL_TECHS.reduce((sum, tech) =>
        sum + tech.topics.filter(top => completed[`${tech.id}-${top.id}`]).reduce((a, top) => a + top.xp, 0), 0
    );

    const completedTopics = ALL_TECHS.reduce((sum, tech) =>
        sum + tech.topics.filter(top => completed[`${tech.id}-${top.id}`]).length, 0
    );

    const overallPct = Math.round((completedTopics / totalTopics) * 100);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-heading text-text-primary">📚 Learn</h1>
                    <p className="text-sm text-text-muted mt-1">
                        {totalTopics} interactive topics across 10 technologies
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-mono font-bold text-brutal-yellow">
                        {earnedXP.toLocaleString()} <span className="text-sm text-text-muted">/ {totalXP.toLocaleString()} XP</span>
                    </div>
                    <div className="text-xs text-text-muted">{completedTopics}/{totalTopics} topics done</div>
                </div>
            </div>

            {/* Overall Progress */}
            <div>
                <div className="flex justify-between text-xs text-text-muted mb-1">
                    <span>Overall Progress</span><span>{overallPct}%</span>
                </div>
                <div className="w-full h-2 bg-bg-elevated rounded-full overflow-hidden">
                    <div className="h-2 rounded-full bg-brutal-mint transition-all duration-700"
                        style={{ width: `${overallPct}%` }} />
                </div>
            </div>

            {/* Layer Groups */}
            {['Foundation', 'Advanced', 'Expert'].map(layer => {
                const layerTechs = ALL_TECHS.filter(t => t.meta.layer === layer);
                return (
                    <div key={layer}>
                        <div className="flex items-center gap-2 mb-3">
                            <span className={`text-xs font-mono px-2 py-0.5 border rounded ${LAYER_COLORS[layer]}`}>{layer}</span>
                            <div className="flex-1 h-px bg-brutal-black" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {layerTechs.map(tech => {
                                const doneCount = tech.topics.filter(top => completed[`${tech.id}-${top.id}`]).length;
                                const techPct = Math.round((doneCount / tech.topics.length) * 100);
                                const techXP = tech.topics.reduce((s, t) => s + t.xp, 0);
                                const color = tech.meta.color || 'cyan';
                                const ringColor = RING_COLORS[color] || RING_COLORS.cyan;
                                const border = BORDER_CLASSES[color] || BORDER_CLASSES.cyan;

                                return (
                                    <button
                                        key={tech.id}
                                        onClick={() => navigate(`/learn/${tech.id}`)}
                                        className={`brutal-card p-5 text-left transition-all duration-200 group cursor-pointer hover:scale-[1.02] ${border}`}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{tech.meta.emoji}</span>
                                                <div>
                                                    <h3 className="font-semibold text-text-primary text-sm leading-tight">{tech.meta.name}</h3>
                                                    <div className="text-xs text-text-muted mt-0.5">{tech.topics.length} topics</div>
                                                </div>
                                            </div>
                                            <div className="relative shrink-0">
                                                <CompletionRing pct={techPct} color={ringColor} size={44} />
                                                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-text-secondary">
                                                    {techPct}%
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-xs text-text-muted mb-4 leading-relaxed">{tech.meta.description}</p>

                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-mono text-brutal-yellow flex items-center gap-1">
                                                <Zap size={10} /> {techXP.toLocaleString()} XP
                                            </span>
                                            <span className="text-xs text-text-muted flex items-center gap-1">
                                                {doneCount}/{tech.topics.length}
                                                <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
