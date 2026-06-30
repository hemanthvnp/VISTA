/** @fileoverview Notes page - per-technology markdown notes with auto-save, AI quality check, and Medium publishing */
import { useState, useEffect, useRef, useCallback } from 'react';
import useNotesStore from '../store/useNotesStore';
import useAppStore from '../store/useAppStore';
import {
  getNotes, updateNotes, checkNoteQuality, publishNoteToMedium,
  connectMedium, getMediumStatus, disconnectMedium,
} from '../api/learning';
import BrutalCard from '../components/ui/BrutalCard';
import QualityScore from '../components/notes/QualityScore';
import MediumConnectionPanel from '../components/notes/MediumConnectionPanel';
import { TECHNOLOGIES } from '../utils/typingGeminiPrompt';
import { FileText, Save, Download, Hash, Sparkles, Send, CheckCircle2, ExternalLink } from 'lucide-react';

const PUBLISH_THRESHOLD = 70;

export default function Notes() {
  const { currentTechId, setCurrentTech, setNoteContent, getNoteContent } = useNotesStore();
  const activeTech = useAppStore((s) => s.activeTech);
  const [content, setContent] = useState('');
  const [note, setNote] = useState(null);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [checkingQuality, setCheckingQuality] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [mediumStatus, setMediumStatus] = useState(null);
  const [connectingMedium, setConnectingMedium] = useState(false);
  const saveTimerRef = useRef(null);

  useEffect(() => {
    if (!currentTechId && activeTech) setCurrentTech(activeTech);
  }, [activeTech]);

  useEffect(() => {
    getMediumStatus().then(setMediumStatus).catch(() => setMediumStatus({ connected: false }));
  }, []);

  useEffect(() => {
    const cached = getNoteContent(currentTechId);
    if (cached) setContent(cached);

    const load = async () => {
      try {
        const data = await getNotes(currentTechId);
        const text = data.content || '';
        setContent(text);
        setNote(data);
        setNoteContent(currentTechId, text);
      } catch (e) {
        setContent('');
        setNote(null);
      }
    };
    if (currentTechId) load();
  }, [currentTechId]);

  const saveNote = useCallback(async (text) => {
    setSaving(true);
    try {
      const saved = await updateNotes(currentTechId, text);
      setNote(saved);
      setNoteContent(currentTechId, text);
      setLastSaved(new Date());
      return saved;
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

  const handleCheckQuality = async () => {
    setCheckingQuality(true);
    try {
      await saveNote(content);
      const result = await checkNoteQuality(currentTechId);
      setNote(result);
    } catch (e) {
      console.error('Quality check error:', e);
      alert(e.payload?.message || e.message || 'Quality check failed.');
    } finally {
      setCheckingQuality(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const result = await publishNoteToMedium(currentTechId);
      setNote(result);
    } catch (e) {
      console.error('Publish error:', e);
      alert(e.payload?.message || e.message || 'Publish failed.');
    } finally {
      setPublishing(false);
    }
  };

  const handleMediumConnect = async (token) => {
    setConnectingMedium(true);
    try {
      await connectMedium(token);
      const status = await getMediumStatus();
      setMediumStatus(status);
    } finally {
      setConnectingMedium(false);
    }
  };

  const handleMediumDisconnect = async () => {
    try {
      await disconnectMedium();
      setMediumStatus({ connected: false });
    } catch (e) {
      console.error('Medium disconnect error:', e);
    }
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const isStale = note?.qualityScore != null && note?.content !== content;
  const isEligible = mediumStatus?.connected && note?.qualityScore != null && note.qualityScore >= PUBLISH_THRESHOLD && !isStale;

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
      <div className="flex-1 flex flex-col min-w-0">
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

      {/* Publish Panel */}
      <div className="w-80 flex-shrink-0 space-y-3 overflow-y-auto">
        <BrutalCard>
          <h3 className="text-sm font-semibold text-text-primary mb-1 flex items-center gap-2">
            <Sparkles size={15} className="text-brutal-purple" /> Quality Check
          </h3>
          <p className="text-xs text-text-muted mb-3">
            Get an AI assessment of how publish-ready this note is before sending it to Medium.
          </p>
          <button
            onClick={handleCheckQuality}
            disabled={checkingQuality}
            className="w-full px-4 py-2 bg-brutal-purple text-white border-2 border-brutal-black rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-brutal-purple/90 transition-colors disabled:opacity-50"
          >
            {checkingQuality ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <Sparkles size={14} /> Check Quality
              </>
            )}
          </button>

          {note?.qualityScore != null && (
            <div className="mt-3">
              <QualityScore score={note.qualityScore} feedback={note.qualityFeedback} stale={isStale} />
            </div>
          )}
        </BrutalCard>

        <MediumConnectionPanel
          status={mediumStatus}
          onConnect={handleMediumConnect}
          onDisconnect={handleMediumDisconnect}
          connecting={connectingMedium}
        />

        {note?.mediumPostUrl ? (
          <BrutalCard color="mint">
            <h4 className="text-xs font-bold uppercase tracking-wide text-success-text flex items-center gap-1.5 mb-2">
              <CheckCircle2 size={13} /> Published on Medium
            </h4>
            <p className="text-xs text-text-muted mb-2">
              {note.publishedAt ? new Date(note.publishedAt).toLocaleDateString() : ''}
            </p>
            <a
              href={note.mediumPostUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-brutal-purple hover:underline inline-flex items-center gap-1"
            >
              View on Medium <ExternalLink size={11} />
            </a>
          </BrutalCard>
        ) : (
          <BrutalCard>
            <button
              onClick={handlePublish}
              disabled={!isEligible || publishing}
              title={!isEligible ? `Connect Medium and reach a quality score of ${PUBLISH_THRESHOLD}+ to publish` : ''}
              className="w-full px-4 py-2.5 bg-brutal-yellow text-text-primary border-2 border-brutal-black rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-brutal-yellow/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {publishing ? (
                <>
                  <span className="w-4 h-4 border-2 border-text-primary border-t-transparent rounded-full animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Send size={15} /> Publish to Medium
                </>
              )}
            </button>
            {!isEligible && (
              <p className="text-xs text-text-muted mt-2 text-center">
                {!mediumStatus?.connected
                  ? 'Connect Medium above to enable publishing.'
                  : isStale
                    ? 'Re-run Check Quality after your edits to publish.'
                    : `Reach a quality score of ${PUBLISH_THRESHOLD}+ to publish.`}
              </p>
            )}
          </BrutalCard>
        )}
      </div>
    </div>
  );
}
