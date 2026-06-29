/** @fileoverview Schedule page - flexible weekly task management */
import { useState, useEffect } from 'react';
import { getSchedule, createWeek, updateWeek, deleteWeek } from '../api/learning';
import { addXP } from '../api/progress';
import BrutalCard from '../components/ui/BrutalCard';
import { TECHNOLOGIES } from '../utils/typingGeminiPrompt';
import { Calendar, Plus, Check, Trash2, Edit2 } from 'lucide-react';

export default function Schedule() {
  const [weeks, setWeeks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [newWeek, setNewWeek] = useState({ techId: 'python', topic: '', task: '', targetHours: 3 });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getSchedule();
        setWeeks(data.weeks || data || []);
      } catch (e) { console.error(e); }
    };
    load();
  }, []);

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
        <button onClick={() => setShowAdd(!showAdd)}
          className="px-3 py-1.5 bg-brutal-mint/20 text-brutal-mint border-2 border-brutal-black rounded-lg text-sm flex items-center gap-1">
          <Plus size={14} /> Add Week
        </button>
      </div>

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
