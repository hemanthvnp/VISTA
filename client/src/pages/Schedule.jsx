/** @fileoverview Schedule page - flexible weekly task management */
import { useState, useEffect } from 'react';
import { getSchedule, createWeek, updateWeek, deleteWeek, generateSchedule } from '../api/learning';
import { addXP } from '../api/progress';
import BrutalCard from '../components/ui/BrutalCard';
import { TECHNOLOGIES } from '../utils/typingGeminiPrompt';
import { Calendar, Plus, Check, Trash2, Sparkles, X } from 'lucide-react';

const DEFAULT_INTAKE = {
  techIds: ['python'],
  skillLevel: 'beginner',
  goal: '',
  weeks: 8,
  hoursPerWeek: 5,
  focus: '',
};

export default function Schedule() {
  const [weeks, setWeeks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [newWeek, setNewWeek] = useState({ techId: 'python', topic: '', task: '', targetHours: 3 });

  // AI setup wizard
  const [showWizard, setShowWizard] = useState(false);
  const [intake, setIntake] = useState(DEFAULT_INTAKE);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState('');

  const load = async () => {
    try {
      const data = await getSchedule();
      setWeeks(data.weeks || data || []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { load(); }, []);

  const toggleTech = (id) => {
    setIntake((prev) => ({
      ...prev,
      techIds: prev.techIds.includes(id)
        ? prev.techIds.filter((t) => t !== id)
        : [...prev.techIds, id],
    }));
  };

  const handleGenerate = async () => {
    if (intake.techIds.length === 0) { setGenError('Pick at least one technology'); return; }
    setGenerating(true);
    setGenError('');
    try {
      const data = await generateSchedule({ ...intake, replace: true });
      setWeeks(data.weeks || []);
      setShowWizard(false);
    } catch (e) {
      setGenError(e.message || 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const handleAdd = async () => {
    if (!newWeek.topic) return;
    try {
      const weekNum = weeks.length + 1;
      const data = await createWeek({ ...newWeek, weekNumber: weekNum });
      setWeeks([...weeks, data.week || data]);
      setNewWeek({ techId: 'python', topic: '', task: '', targetHours: 3 });
      setShowAdd(false);
    } catch (e) { console.error(e); }
  };

  const handleComplete = async (week) => {
    try {
      await updateWeek(week._id, { completed: !week.completed });
      if (!week.completed) await addXP('complete_schedule_week', 100);
      setWeeks(weeks.map(w => w._id === week._id ? { ...w, completed: !w.completed } : w));
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteWeek(id);
      setWeeks(weeks.filter(w => w._id !== id));
    } catch (e) { console.error(e); }
  };

  const filtered = weeks.filter((w) => {
    if (filter === 'completed') return w.completed;
    if (filter === 'remaining') return !w.completed;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-heading text-text-primary flex items-center gap-2">
          <Calendar className="text-brutal-mint" size={22} /> Learning Schedule
        </h1>
        <div className="flex items-center gap-2">
          <button onClick={() => { setShowWizard(true); setGenError(''); }}
            className="px-3 py-1.5 bg-brutal-purple/20 text-brutal-purple border-2 border-brutal-black rounded-lg text-sm flex items-center gap-1 font-semibold">
            <Sparkles size={14} /> AI Setup
          </button>
          <button onClick={() => setShowAdd(!showAdd)}
            className="px-3 py-1.5 bg-brutal-mint/20 text-brutal-mint border-2 border-brutal-black rounded-lg text-sm flex items-center gap-1">
            <Plus size={14} /> Add Week
          </button>
        </div>
      </div>

      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => !generating && setShowWizard(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <BrutalCard color="purple" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-heading text-text-primary flex items-center gap-2">
                  <Sparkles size={18} className="text-brutal-purple" /> Build my learning plan
                </h2>
                <button onClick={() => !generating && setShowWizard(false)} className="text-text-muted hover:text-text-primary">
                  <X size={18} />
                </button>
              </div>
              <p className="text-xs text-text-muted">Answer a few questions and AI will design an optimized week-by-week schedule. This replaces your current plan.</p>

              {/* Technologies */}
              <div>
                <label className="text-xs text-text-secondary font-semibold">Which technologies?</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {TECHNOLOGIES.map((t) => (
                    <button key={t.id} onClick={() => toggleTech(t.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs border-2 border-brutal-black transition-colors ${intake.techIds.includes(t.id) ? 'bg-brutal-purple text-white' : 'bg-bg-card text-text-secondary'}`}>
                      {t.emoji} {t.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skill level */}
              <div>
                <label className="text-xs text-text-secondary font-semibold">Current skill level</label>
                <div className="flex gap-2 mt-2">
                  {['beginner', 'intermediate', 'advanced'].map((lvl) => (
                    <button key={lvl} onClick={() => setIntake({ ...intake, skillLevel: lvl })}
                      className={`px-3 py-1 rounded-lg text-xs capitalize border-2 border-brutal-black ${intake.skillLevel === lvl ? 'bg-brutal-mint text-text-primary font-semibold' : 'bg-bg-card text-text-muted'}`}>
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal */}
              <div>
                <label className="text-xs text-text-secondary font-semibold">What's your goal?</label>
                <input value={intake.goal} onChange={(e) => setIntake({ ...intake, goal: e.target.value })}
                  placeholder="e.g. Build an ML side project and land an internship"
                  className="w-full mt-1 bg-bg-card border-2 border-brutal-black rounded-lg px-3 py-2 text-sm text-text-primary focus:border-brutal-purple focus:outline-none" />
              </div>

              {/* Weeks + hours */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-text-secondary font-semibold">Plan length (weeks)</label>
                  <input type="number" min="1" max="26" value={intake.weeks}
                    onChange={(e) => setIntake({ ...intake, weeks: e.target.value })}
                    className="w-full mt-1 bg-bg-card border-2 border-brutal-black rounded-lg px-3 py-2 text-sm text-text-primary focus:border-brutal-purple focus:outline-none" />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-text-secondary font-semibold">Hours / week</label>
                  <input type="number" min="1" max="40" value={intake.hoursPerWeek}
                    onChange={(e) => setIntake({ ...intake, hoursPerWeek: e.target.value })}
                    className="w-full mt-1 bg-bg-card border-2 border-brutal-black rounded-lg px-3 py-2 text-sm text-text-primary focus:border-brutal-purple focus:outline-none" />
                </div>
              </div>

              {/* Focus */}
              <div>
                <label className="text-xs text-text-secondary font-semibold">Anything specific to focus on? (optional)</label>
                <textarea value={intake.focus} onChange={(e) => setIntake({ ...intake, focus: e.target.value })}
                  rows={2} placeholder="e.g. weak on data structures, prefer project-based learning"
                  className="w-full mt-1 bg-bg-card border-2 border-brutal-black rounded-lg px-3 py-2 text-sm text-text-primary focus:border-brutal-purple focus:outline-none resize-none" />
              </div>

              {genError && <p className="text-xs text-error-text">{genError}</p>}

              <button onClick={handleGenerate} disabled={generating}
                className="w-full px-4 py-2.5 bg-brutal-purple text-white rounded-lg text-sm font-semibold border-2 border-brutal-black shadow-brutal-sm flex items-center justify-center gap-2 disabled:opacity-60">
                {generating ? 'Optimizing your schedule…' : <><Sparkles size={14} /> Generate my plan</>}
              </button>
            </BrutalCard>
          </div>
        </div>
      )}

      <div className="flex gap-1 bg-bg-card rounded-lg p-1 border-2 border-brutal-black w-fit">
        {['all', 'remaining', 'completed'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded text-xs capitalize ${filter === f ? 'bg-brutal-yellow text-text-primary border-2 border-brutal-black font-semibold' : 'text-text-muted'}`}>{f}</button>
        ))}
      </div>

      {showAdd && (
        <BrutalCard className="space-y-3">
          <select value={newWeek.techId} onChange={(e) => setNewWeek({...newWeek, techId: e.target.value})}
            className="w-full bg-bg-card border-2 border-brutal-black rounded-lg px-3 py-2 text-sm text-text-primary">
            {TECHNOLOGIES.map(t => <option key={t.id} value={t.id}>{t.emoji} {t.name}</option>)}
          </select>
          <input value={newWeek.topic} onChange={(e) => setNewWeek({...newWeek, topic: e.target.value})} placeholder="Topic"
            className="w-full bg-bg-card border-2 border-brutal-black rounded-lg px-3 py-2 text-sm text-text-primary focus:border-brutal-purple focus:outline-none" />
          <input value={newWeek.task} onChange={(e) => setNewWeek({...newWeek, task: e.target.value})} placeholder="Task description"
            className="w-full bg-bg-card border-2 border-brutal-black rounded-lg px-3 py-2 text-sm text-text-primary focus:border-brutal-purple focus:outline-none" />
          <button onClick={handleAdd} className="px-4 py-2 bg-brutal-purple text-white rounded-lg text-sm font-semibold border-2 border-brutal-black shadow-brutal-sm">Create Week</button>
        </BrutalCard>
      )}

      <div className="space-y-3">
        {filtered.map((week) => {
          const tech = TECHNOLOGIES.find(t => t.id === week.techId);
          return (
            <BrutalCard key={week._id} color={week.completed ? 'none' : 'cyan'}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => handleComplete(week)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${week.completed ? 'border-success bg-success-soft' : 'border-brutal-black'}`}>
                    {week.completed && <Check size={12} className="text-success-text" />}
                  </button>
                  <div>
                    <h4 className={`text-sm font-semibold ${week.completed ? 'text-success-text line-through' : 'text-text-primary'}`}>
                      Week {week.weekNumber} — {tech?.emoji} {week.topic}
                    </h4>
                    <p className="text-xs text-text-muted">{week.task} ({week.targetHours}h target)</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(week._id)} className="text-text-muted hover:text-error-text">
                  <Trash2 size={14} />
                </button>
              </div>
            </BrutalCard>
          );
        })}
      </div>
    </div>
  );
}
