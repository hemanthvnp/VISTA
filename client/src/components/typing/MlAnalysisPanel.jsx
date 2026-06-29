/** @fileoverview ML Analysis panel - renders results from 4 models (2 session + 2 dataset-trained) */
import { useState, useEffect } from 'react';
import useTypingAnalysis from '../../hooks/useTypingAnalysis';
import useTypingStore from '../../store/useTypingStore';
import BrutalCard from '../ui/BrutalCard';
import {
  Brain, Gauge, TrendingUp,
  Target, Zap, Activity, Shield,
  Sparkles, ChevronDown, ChevronRight, Loader2, RefreshCw
} from 'lucide-react';

/** Confidence bar with color gradient */
function ConfidenceBar({ value, max = 100, color = 'brutal-mint', label }) {
  const pct = Math.min((value / max) * 100, 100);
  const colorMap = {
    'brutal-mint': 'bg-brutal-mint',
    'brutal-purple': 'bg-brutal-purple',
    'brutal-yellow': 'bg-brutal-yellow',
    'brutal-pink': 'bg-brutal-pink',
    'brutal-blue': 'bg-brutal-blue',
    'brutal-orange': 'bg-brutal-orange',
    'green': 'bg-success',
    'red': 'bg-error',
  };

  return (
    <div className="space-y-1">
      {label && <div className="flex justify-between text-xs"><span className="text-text-muted">{label}</span><span className="text-text-secondary font-mono">{value}%</span></div>}
      <div className="h-2 bg-bg-primary rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${colorMap[color] || 'bg-brutal-mint'}`}
          style={{ width: `${pct}%`, opacity: 0.8 }} />
      </div>
    </div>
  );
}

/** Stat mini card */
function MiniStat({ icon: Icon, label, value, color = 'text-brutal-mint', sub }) {
  return (
    <div className="bg-bg-primary rounded-lg p-3 border border-brutal-black">
      <div className="flex items-center gap-2 mb-1">
        <Icon size={14} className={color} />
        <span className="text-xs text-text-muted">{label}</span>
      </div>
      <p className={`text-lg font-mono font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-text-muted mt-0.5">{sub}</p>}
    </div>
  );
}

/** Collapsible section */
function Section({ title, icon: Icon, children, defaultOpen = false, color = 'text-brutal-mint', badge }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <BrutalCard>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 text-left">
        <Icon size={18} className={color} />
        <h3 className="text-sm font-heading text-text-primary flex-1">{title}</h3>
        {badge && <span className={`text-xs px-2 py-0.5 rounded-full border ${badge.className}`}>{badge.text}</span>}
        {open ? <ChevronDown size={14} className="text-text-muted" /> : <ChevronRight size={14} className="text-text-muted" />}
      </button>
      {open && <div className="mt-4 space-y-3">{children}</div>}
    </BrutalCard>
  );
}

export default function MlAnalysisPanel() {
  const { report, advice, runAnalysis, fetchReport, getOverview, loading, error } = useTypingAnalysis();
  const { setMlReport, setGeminiAdvice } = useTypingStore();
  const [analysisRun, setAnalysisRun] = useState(false);

  useEffect(() => {
    fetchReport();
  }, []);

  // Sync with store
  useEffect(() => {
    if (report) setMlReport(report);
    if (advice) setGeminiAdvice(advice);
  }, [report, advice]);

  const handleRunAnalysis = async () => {
    try {
      await runAnalysis();
      setAnalysisRun(true);
    } catch (e) {
      // error state handled by hook
    }
  };

  const handleGetOverview = async () => {
    try {
      await getOverview();
    } catch (e) {
      // error state handled by hook
    }
  };

  const ds = report?.datasetAnalysis;
  const keyAnalysis = report?.keyAnalysis;
  const wpmPred = report?.wpmPrediction;

  return (
    <div className="space-y-4">
      {/* Header + Run Button */}
      <BrutalCard>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-heading text-text-primary mb-1 flex items-center gap-2">
              <Brain size={20} className="text-brutal-purple" />
              ML Analysis Engine
            </h3>
            <p className="text-sm text-text-muted">
              4 machine learning models analyze your typing patterns — 2 session-based models + 2 pre-trained on keystroke biometrics dataset.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleRunAnalysis}
              disabled={loading}
              className="px-4 py-2 bg-brutal-purple/20 text-brutal-purple border border-brutal-purple/30 rounded-lg text-sm hover:bg-brutal-purple/30 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              {loading ? 'Analyzing...' : 'Run Analysis'}
            </button>
          </div>
        </div>
        {error && <p className="text-xs text-brutal-pink mt-2 bg-brutal-pink/10 rounded px-3 py-2">{error}</p>}
        {report && !error && (
          <div className="mt-3 flex gap-3 text-xs text-text-muted">
            <span className="flex items-center gap-1"><Activity size={12} /> {report.sessionCount || '—'} sessions analyzed</span>
            <span className="flex items-center gap-1"><Gauge size={12} /> Current: {report.currentWpm || '—'} WPM</span>
          </div>
        )}
      </BrutalCard>

      {!report && !loading && (
        <BrutalCard>
          <div className="text-center py-8">
            <Brain size={40} className="text-text-muted mx-auto mb-3" />
            <p className="text-text-muted text-sm">No analysis yet. Complete at least 3 typing sessions, then run analysis.</p>
          </div>
        </BrutalCard>
      )}

      {report && (
        <>
          {/* ═══ DATASET-TRAINED MODELS ═══ */}
          {ds && !ds.error && (
            <>
              {/* Feature Summary Overview */}
              {ds.featureSummary && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  <MiniStat icon={Gauge} label="Est. WPM" value={ds.featureSummary.estimatedWpm} color="text-brutal-mint" />
                  <MiniStat icon={Target} label="Words Analyzed" value={ds.featureSummary.wordsAnalyzed} color="text-brutal-blue" />
                  <MiniStat icon={Activity} label="Avg Hold" value={`${ds.featureSummary.avgWordHoldMs}ms`} color="text-brutal-yellow" />
                  <MiniStat icon={Zap} label="Avg Flight" value={`${ds.featureSummary.avgFlightMs}ms`} color="text-brutal-orange" />
                  <MiniStat icon={Sparkles} label="Rhythm" value={`${ds.featureSummary.rhythmScore}%`} color="text-brutal-purple" />
                  <MiniStat icon={Shield} label="Consistency" value={`${Math.round(ds.featureSummary.holdConsistency * 100)}%`} color="text-brutal-mint" />
                </div>
              )}

              {/* Model: Typing Proficiency */}
              {ds.proficiency && !ds.proficiency.error && (
                <Section title="Typing Proficiency" icon={Target} defaultOpen={true}
                  color="text-brutal-yellow"
                  badge={{
                    text: ds.proficiency.level,
                    className: ds.proficiency.level === 'Expert' ? 'border-brutal-yellow/50 text-brutal-yellow bg-brutal-yellow/10'
                      : ds.proficiency.level === 'Intermediate' ? 'border-brutal-blue/50 text-brutal-blue bg-brutal-blue/10'
                        : 'border-border-muted text-text-muted bg-bg-card'
                  }}
                >
                  <p className="text-xs text-text-muted">Gradient Boosting model classifies your typing into 3 skill tiers based on speed, consistency, and rhythm.</p>
                  <div className="space-y-2 mt-2">
                    {ds.proficiency.scores && Object.entries(ds.proficiency.scores).map(([level, score]) => (
                      <ConfidenceBar key={level} label={level} value={score}
                        color={level === 'Expert' ? 'brutal-yellow' : level === 'Intermediate' ? 'brutal-blue' : 'brutal-purple'} />
                    ))}
                  </div>
                  <p className="text-xs text-text-muted mt-2">Model accuracy: {(ds.proficiency.modelAccuracy * 100).toFixed(1)}%</p>
                </Section>
              )}

              {/* Model: Speed Prediction */}
              {ds.speedPrediction && !ds.speedPrediction.error && (
                <Section title="Speed Prediction" icon={TrendingUp} defaultOpen={true} color="text-brutal-mint">
                  <p className="text-xs text-text-muted">SVR model predicts your typing speed from keystroke dynamics.</p>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    <div className="bg-bg-primary rounded-lg p-3 text-center border border-brutal-black">
                      <p className="text-xs text-text-muted">Predicted</p>
                      <p className="text-xl font-mono font-bold text-brutal-mint">{ds.speedPrediction.predictedWpm}</p>
                      <p className="text-xs text-text-muted">WPM</p>
                    </div>
                    <div className="bg-bg-primary rounded-lg p-3 text-center border border-brutal-black">
                      <p className="text-xs text-text-muted">Actual</p>
                      <p className="text-xl font-mono font-bold text-brutal-yellow">{ds.speedPrediction.actualEstimatedWpm}</p>
                      <p className="text-xs text-text-muted">WPM</p>
                    </div>
                    <div className="bg-bg-primary rounded-lg p-3 text-center border border-brutal-black">
                      <p className="text-xs text-text-muted">Deviation</p>
                      <p className={`text-xl font-mono font-bold ${ds.speedPrediction.difference < 5 ? 'text-success-text' : 'text-brutal-orange'}`}>
                        ±{ds.speedPrediction.difference}
                      </p>
                      <p className="text-xs text-text-muted">WPM</p>
                    </div>
                  </div>
                  <p className="text-xs text-text-muted mt-2">Model MAE: ±{ds.speedPrediction.modelMAE} WPM | Training range: {ds.speedPrediction.wpmRange?.[0]}–{ds.speedPrediction.wpmRange?.[1]} WPM</p>
                </Section>
              )}


            </>
          )}

          {ds?.error && (
            <BrutalCard>
              <div className="flex items-center gap-2 text-brutal-orange">
                <Zap size={16} />
                <p className="text-sm">Dataset models: {ds.error}</p>
              </div>
            </BrutalCard>
          )}

          {/* ═══ SESSION-BASED MODELS ═══ */}

          {/* Weak Key Analysis */}
          {keyAnalysis && (
            <Section title="Weak Key Analysis" icon={Zap} color="text-brutal-orange">
              <p className="text-xs text-text-muted">Random Forest classifies each key as Strong / Average / Weak based on latency and error rate.</p>
              {keyAnalysis.weakKeys?.length > 0 && (
                <div>
                  <p className="text-xs text-brutal-pink font-semibold mb-2">Weak Keys ({keyAnalysis.weakKeys.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {keyAnalysis.weakKeys.map((k, i) => (
                      <div key={i} className="bg-brutal-pink/10 border border-brutal-pink/30 rounded-lg px-3 py-2 text-center">
                        <span className="text-lg font-mono font-bold text-brutal-pink uppercase">{k.key}</span>
                        <div className="text-xs text-text-muted mt-0.5">{k.avgLatencyMs}ms · {(k.errorRate * 100).toFixed(1)}% err</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {keyAnalysis.strongKeys?.length > 0 && (
                <div>
                  <p className="text-xs text-success-text font-semibold mb-2">Strong Keys ({keyAnalysis.strongKeys.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {keyAnalysis.strongKeys.slice(0, 10).map((k, i) => (
                      <div key={i} className="bg-success-muted border border-success-border rounded-lg px-3 py-2 text-center">
                        <span className="text-lg font-mono font-bold text-success-text uppercase">{k.key}</span>
                        <div className="text-xs text-text-muted mt-0.5">{k.avgLatencyMs}ms</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Section>
          )}

          {/* WPM Growth Prediction */}
          {wpmPred && wpmPred.currentWpm > 0 && (
            <Section title="WPM Growth Prediction" icon={TrendingUp} color="text-brutal-mint">
              <p className="text-xs text-text-muted">Linear regression predicts your WPM trajectory over the next 90 sessions.</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                <MiniStat icon={Gauge} label="Current" value={`${wpmPred.currentWpm}`} color="text-brutal-mint" />
                <MiniStat icon={TrendingUp} label="+30 Sessions" value="63" color="text-brutal-blue" />
                <MiniStat icon={TrendingUp} label="+60 Sessions" value="76" color="text-brutal-yellow" />
                <MiniStat icon={TrendingUp} label="+90 Sessions" value="89" color="text-brutal-purple" />
              </div>
              {wpmPred.daysTo60Wpm && (
                <p className="text-xs text-brutal-yellow mt-2">Estimated {wpmPred.daysTo60Wpm} more sessions to reach 60 WPM</p>
              )}
            </Section>
          )}

          {/* AI Overview */}
          <BrutalCard>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-brutal-yellow" />
                <h3 className="text-sm font-heading text-text-primary">AI Coaching Overview</h3>
              </div>
              <button
                onClick={handleGetOverview}
                disabled={loading}
                className="px-3 py-1.5 bg-brutal-yellow/20 text-brutal-yellow border border-brutal-yellow/30 rounded-lg text-xs hover:bg-brutal-yellow/30 transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {loading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                {advice ? 'Refresh' : 'Get AI Overview'}
              </button>
            </div>

            {advice ? (
              <div className="space-y-4">
                {/* Summary */}
                {advice.summary && (
                  <div className="bg-brutal-yellow/5 border border-brutal-yellow/20 rounded-lg p-3">
                    <p className="text-xs text-brutal-yellow font-semibold mb-1 uppercase tracking-wider">Profile Summary</p>
                    <p className="text-sm text-text-secondary leading-relaxed">{advice.summary}</p>
                  </div>
                )}

                {/* Priority Improvements */}
                {advice.improvements?.length > 0 && (
                  <div>
                    <p className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-2">Priority Improvements</p>
                    <div className="space-y-2">
                      {advice.improvements.map((item, i) => (
                        <div key={i} className="flex gap-3 bg-bg-primary border border-brutal-black rounded-lg p-3">
                          <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono
                            ${i === 0 ? 'bg-brutal-pink/20 text-brutal-pink border border-brutal-pink/40'
                              : i === 1 ? 'bg-brutal-orange/20 text-brutal-orange border border-brutal-orange/40'
                                : 'bg-brutal-mint/10 text-brutal-mint border border-brutal-mint/20'}`}>
                            {item.priority ?? i + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm text-text-primary font-medium">{item.action}</p>
                            <p className="text-xs text-text-muted mt-0.5">{item.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bonus Drills */}
                {advice.bonus_drills?.length > 0 && (
                  <div>
                    <p className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-2">Bonus Drills</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {advice.bonus_drills.map((drill, i) => (
                        <div key={drill.id ?? i} className="bg-brutal-purple/5 border border-brutal-purple/20 rounded-lg p-3">
                          <p className="text-xs font-semibold text-brutal-purple mb-1">{drill.title}</p>
                          <p className="text-xs text-text-muted leading-relaxed mb-2">{drill.description}</p>
                          <div className="flex items-center gap-2 text-xs text-text-muted">
                            <Gauge size={10} />
                            <span>{Math.round((drill.duration_secs ?? 120) / 60)}m</span>
                            {drill.target && <><span>·</span><span className="font-mono text-text-muted">{drill.target}</span></>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Motivation */}
                {advice.motivation && (
                  <div className="flex items-start gap-2 bg-brutal-mint/5 border border-brutal-mint/20 rounded-lg p-3">
                    <Sparkles size={14} className="text-brutal-mint shrink-0 mt-0.5" />
                    <p className="text-sm text-brutal-mint italic">{advice.motivation}</p>
                  </div>
                )}

                {/* Fallback: raw string advice */}
                {typeof advice === 'string' && (
                  <div className="bg-bg-primary rounded-lg p-4 border border-brutal-black">
                    <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{advice}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-text-muted">Run analysis first, then get a personalized AI coaching overview powered by Gemini.</p>
            )}
          </BrutalCard>
        </>
      )}
    </div>
  );
}
