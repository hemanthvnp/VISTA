/** @fileoverview Notes page - per-technology markdown notes with auto-save */
import { useState, useEffect, useRef, useCallback } from 'react';
import useNotesStore from '../store/useNotesStore';
import useAppStore from '../store/useAppStore';
import { getNotes, updateNotes } from '../api/learning';
import BrutalCard from '../components/ui/BrutalCard';
import { TECHNOLOGIES } from '../utils/typingGeminiPrompt';
import { FileText, Save, Download, Hash } from 'lucide-react';

export default function Notes() {
  const { currentTechId, setCurrentTech, setNoteContent, getNoteContent } = useNotesStore();
  const activeTech = useAppStore((s) => s.activeTech);
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const saveTimerRef = useRef(null);

  useEffect(() => {
    if (!currentTechId && activeTech) setCurrentTech(activeTech);
  }, [activeTech]);

  useEffect(() => {
    const load = async () => {
      const cached = getNoteContent(currentTechId);
      if (cached) {
        setContent(cached);
        return;
      }
      try {
        const data = await getNotes(currentTechId);
        const text = data.content || data.notes || '';
        setContent(text);
        setNoteContent(currentTechId, text);
      } catch (e) {
        setContent('');
      }
    };
    if (currentTechId) load();
  }, [currentTechId]);

  const saveNote = useCallback(async (text) => {
    setSaving(true);
    try {
      await updateNotes(currentTechId, text);
      setNoteContent(currentTechId, text);
      setLastSaved(new Date());
    } catch (e) {
      console.error('Note save error:', e);
    } finally {
      setSaving(false);
    }
  }, [currentTechId, setNoteContent]);

  const handleChange = (e) => {
    const val = e.target.value;
    setContent(val);
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => saveNote(val), 1500);
  };

  const handleExport = () => {
    const tech = TECHNOLOGIES.find(t => t.id === currentTechId);
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tech?.name || currentTechId}-notes.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div className="flex gap-4 h-[calc(100vh-8rem)]">
      {/* Tech Sidebar */}
      <div className="w-48 flex-shrink-0 space-y-1">
        <h3 className="text-xs text-text-muted uppercase mb-2">Technologies</h3>
        {TECHNOLOGIES.map((tech) => (
          <button
            key={tech.id}
            onClick={() => { setCurrentTech(tech.id); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              currentTechId === tech.id
                ? 'bg-brutal-yellow text-text-primary border-2 border-brutal-black font-semibold'
                : 'text-text-muted hover:text-text-secondary hover:bg-bg-card'
            }`}
          >
            {tech.emoji} {tech.name}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-heading text-text-primary flex items-center gap-2">
            <FileText className="text-brutal-mint" size={22} /> Notes
            <span className="text-sm text-text-muted font-normal">
              — {TECHNOLOGIES.find(t => t.id === currentTechId)?.emoji} {TECHNOLOGIES.find(t => t.id === currentTechId)?.name}
            </span>
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted flex items-center gap-1">
              <Hash size={12} /> {wordCount} words
            </span>
            {lastSaved && (
              <span className="text-xs text-text-muted">
                {saving ? 'Saving...' : 'Saved'}
              </span>
            )}
            <button onClick={() => saveNote(content)}
              className="px-3 py-1.5 text-xs border-2 border-brutal-black rounded-lg text-text-secondary hover:border-brutal-mint hover:text-brutal-mint flex items-center gap-1">
              <Save size={12} /> Save
            </button>
            <button onClick={handleExport}
              className="px-3 py-1.5 text-xs border-2 border-brutal-black rounded-lg text-text-secondary hover:border-brutal-yellow hover:text-brutal-yellow flex items-center gap-1">
              <Download size={12} /> Export
            </button>
          </div>
        </div>
        <textarea
          value={content}
          onChange={handleChange}
          placeholder={`Start writing notes for ${TECHNOLOGIES.find(t => t.id === currentTechId)?.name || 'this technology'}...\n\nSupports markdown formatting.`}
          className="flex-1 w-full bg-bg-card border-2 border-brutal-black rounded-lg p-4 text-sm text-text-primary font-mono leading-relaxed resize-none focus:outline-none focus:border-brutal-purple"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
