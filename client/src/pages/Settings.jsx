/** @fileoverview Settings page - profile, tech selector, gate duration, account management */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useAppStore from '../store/useAppStore';
import { updateProfile, changePassword, deleteAccount } from '../api/auth';
import BrutalCard from '../components/ui/BrutalCard';
import { TECHNOLOGIES } from '../utils/typingGeminiPrompt';
import { User, Settings as SettingsIcon, Shield, Info, Bell, Trash2, Sun, Moon, Monitor } from 'lucide-react';
import useTheme from '../hooks/useTheme';

export default function Settings() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const logout = useAuthStore((s) => s.logout);
  const setActiveTech = useAppStore((s) => s.setActiveTech);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [activeTechId, setActiveTechId] = useState(user?.activeTechId || 'python');
  const [gateDuration, setGateDuration] = useState(user?.gateDurationMinutes || 5);
  const [weeklyHours, setWeeklyHours] = useState(user?.weeklyHourTarget || 3);
  const [reminderEnabled, setReminderEnabled] = useState(user?.reminderEnabled || false);
  const [reminderTime, setReminderTime] = useState(user?.reminderTime || '09:00');
  const [saved, setSaved] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const handleSave = async () => {
    try {
      await updateProfile({ name, activeTechId, gateDurationMinutes: gateDuration, weeklyHourTarget: weeklyHours, reminderEnabled, reminderTime });
      updateUser({ name, activeTechId, gateDurationMinutes: gateDuration, weeklyHourTarget: weeklyHours, reminderEnabled, reminderTime });
      setActiveTech(activeTechId);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error('Save error:', e);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPass || !newPass) return;
    try {
      await changePassword(oldPass, newPass);
      setOldPass(''); setNewPass('');
      alert('Password changed');
    } catch (e) {
      alert(e.message || 'Failed');
    }
  };

  const handleDelete = async () => {
    if (deleteConfirm !== 'DELETE') return;
    try {
      await deleteAccount();
      logout();
      navigate('/login');
    } catch (e) {
      alert(e.message || 'Failed');
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-heading text-text-primary flex items-center gap-2">
        <SettingsIcon className="text-brutal-mint" size={22} /> Settings
      </h1>

      {/* Profile */}
      <BrutalCard>
        <h3 className="text-sm text-text-secondary mb-3 flex items-center gap-2"><User size={16} /> Profile</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-text-muted">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)}
              className="w-full bg-bg-card border-2 border-brutal-black rounded-lg px-3 py-2 text-text-primary text-sm mt-1 focus:border-brutal-purple focus:outline-none" />
          </div>
          <div>
            <label className="text-xs text-text-muted">Active Technology</label>
            <select value={activeTechId} onChange={(e) => setActiveTechId(e.target.value)}
              className="w-full bg-bg-card border-2 border-brutal-black rounded-lg px-3 py-2 text-text-primary text-sm mt-1 focus:border-brutal-purple focus:outline-none">
              {TECHNOLOGIES.map((t) => (
                <option key={t.id} value={t.id}>{t.emoji} {t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-text-muted">Gate Duration</label>
            <div className="flex gap-2 mt-1">
              {[1, 2, 3, 5, 10].map((m) => (
                <button key={m} onClick={() => setGateDuration(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs ${gateDuration === m ? 'bg-brutal-yellow text-text-primary border-2 border-brutal-black font-semibold' : 'border-2 border-brutal-black text-text-muted'}`}>
                  {m}m
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-text-muted">Weekly Study Target: {weeklyHours}h</label>
            <input type="range" min="1" max="20" value={weeklyHours} onChange={(e) => setWeeklyHours(Number(e.target.value))}
              className="w-full accent-brutal-mint mt-1" />
          </div>
        </div>
        <button onClick={handleSave}
          className="mt-4 px-4 py-2 bg-brutal-purple text-white rounded-lg text-sm font-semibold border-2 border-brutal-black shadow-brutal-sm hover:bg-brutal-purple/90 transition-colors">
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </BrutalCard>

      {/* Theme */}
      <BrutalCard>
        <h3 className="text-sm text-text-secondary mb-3 flex items-center gap-2">
          {theme === 'dark' ? <Moon size={16} /> : theme === 'light' ? <Sun size={16} /> : <Monitor size={16} />} Theme
        </h3>
        <div className="flex gap-2">
          {[
            { id: 'system', label: 'System', icon: <Monitor size={14} /> },
            { id: 'light', label: 'Light', icon: <Sun size={14} /> },
            { id: 'dark', label: 'Dark', icon: <Moon size={14} /> },
          ].map((opt) => (
            <button key={opt.id} onClick={() => setTheme(opt.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm border-2 transition-colors ${
                theme === opt.id
                  ? 'bg-brutal-purple text-white border-brutal-black font-semibold shadow-brutal-sm'
                  : 'border-brutal-black text-text-muted hover:border-brutal-purple'
              }`}>
              {opt.icon} {opt.label}
            </button>
          ))}
        </div>
      </BrutalCard>

      {/* Reminders */}
      <BrutalCard>
        <h3 className="text-sm text-text-secondary mb-3 flex items-center gap-2"><Bell size={16} /> Study Reminders</h3>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={reminderEnabled} onChange={(e) => setReminderEnabled(e.target.checked)}
              className="accent-brutal-mint" />
            <span className="text-sm text-text-primary">Enable daily reminder</span>
          </label>
          <input type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)}
            className="bg-bg-card border-2 border-brutal-black rounded px-2 py-1 text-sm text-text-primary focus:border-brutal-purple focus:outline-none" disabled={!reminderEnabled} />
        </div>
      </BrutalCard>

      {/* Password */}
      <BrutalCard>
        <h3 className="text-sm text-text-secondary mb-3 flex items-center gap-2"><Shield size={16} /> Change Password</h3>
        <div className="flex gap-3">
          <input type="password" placeholder="Old password" value={oldPass} onChange={(e) => setOldPass(e.target.value)}
            className="flex-1 bg-bg-card border-2 border-brutal-black rounded-lg px-3 py-2 text-sm text-text-primary focus:border-brutal-purple focus:outline-none" />
          <input type="password" placeholder="New password" value={newPass} onChange={(e) => setNewPass(e.target.value)}
            className="flex-1 bg-bg-card border-2 border-brutal-black rounded-lg px-3 py-2 text-sm text-text-primary focus:border-brutal-purple focus:outline-none" />
          <button onClick={handleChangePassword}
            className="px-4 py-2 border-2 border-brutal-black rounded-lg text-sm text-text-primary hover:border-brutal-purple">Update</button>
        </div>
      </BrutalCard>

      {/* Danger Zone */}
      <BrutalCard>
        <div className="bg-brutal-coral/10 border-2 border-brutal-black rounded-lg p-4">
          <h3 className="text-sm text-error-text mb-3 flex items-center gap-2"><Trash2 size={16} /> Delete Account</h3>
          <p className="text-xs text-text-muted mb-3">Type DELETE to confirm. This cannot be undone.</p>
          <div className="flex gap-3">
            <input value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} placeholder="Type DELETE"
              className="flex-1 bg-bg-card border-2 border-brutal-black rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none" />
            <button onClick={handleDelete} disabled={deleteConfirm !== 'DELETE'}
              className="px-4 py-2 bg-error-soft text-error-text border-2 border-brutal-black rounded-lg text-sm disabled:opacity-30">Delete</button>
          </div>
        </div>
      </BrutalCard>

      {/* About */}
      <BrutalCard>
        <h3 className="text-sm text-text-secondary mb-2 flex items-center gap-2"><Info size={16} /> About</h3>
        <p className="text-xs text-text-muted">V v1.0 — Velocity-Accelerated NPC Training Architecture</p>
        <p className="text-xs text-text-muted mt-1">Vite + React 18 | Express.js | MongoDB | Gemini AI | scikit-learn</p>
      </BrutalCard>
    </div>
  );
}
