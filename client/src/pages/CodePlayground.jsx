/** @fileoverview Code Playground — Monaco editor with hybrid execution (Pyodide + native JS/TS + Piston). */
import { useState, useCallback } from 'react';
import usePyodide from '../hooks/usePyodide';
import useGemini from '../hooks/useGemini';
import { saveSnippet, getSnippets } from '../api/learning';
import EditorPanel from '../components/code/EditorPanel';
import OutputPanel from '../components/code/OutputPanel';
import LanguagePicker from '../components/code/LanguagePicker';
import BrutalCard from '../components/ui/BrutalCard';
import { Code2, FolderOpen } from 'lucide-react';
import { getLanguage } from '../config/languages';
import { runViaPiston } from '../lib/pistonClient';

export default function CodePlayground() {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(getLanguage('python').starter);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [running, setRunning] = useState(false);
  const [snippets, setSnippets] = useState([]);
  const [showSnippets, setShowSnippets] = useState(false);
  const [aiReview, setAiReview] = useState('');

  const { runPython, loading: pyLoading } = usePyodide();
  const { sendTutorMessage } = useGemini();

  const handleLanguageChange = (id) => {
    setLanguage(id);
    setCode(getLanguage(id).starter);
    setOutput('');
    setError('');
    setAiReview('');
  };

  // --- Runners map. Add a new language in config/languages.js; no change here needed
  //     unless the language uses a bespoke in-browser runtime (like Pyodide).
  const runners = {
    python: async (src) => {
      const r = await runPython(src);
      return { stdout: r.output || '', stderr: r.error || '' };
    },
    javascript: async (src) => {
      const logs = [];
      const mockConsole = {
        log: (...a) => logs.push(a.map(String).join(' ')),
        error: (...a) => logs.push('ERROR: ' + a.map(String).join(' ')),
        warn: (...a) => logs.push('WARN: ' + a.map(String).join(' ')),
      };
      // eslint-disable-next-line no-new-func
      const fn = new Function('console', src);
      fn(mockConsole);
      return { stdout: logs.join('\n'), stderr: '' };
    },
    typescript: async (src) => {
      // Strip type annotations lightly, then run as JS. Good enough for playground.
      const stripped = src
        .replace(/:\s*[A-Za-z_$][\w$<>[\],\s|&'"`?]*(?=[),=;])/g, '')
        .replace(/\bas\s+[A-Za-z_$][\w$<>[\],\s|&]*/g, '')
        .replace(/\binterface\s+\w+\s*\{[^}]*\}/g, '')
        .replace(/\btype\s+\w+\s*=[^;]+;/g, '');
      return runners.javascript(stripped);
    },
  };

  const runViaConfig = async (lang, src) => {
    if (lang.runner === 'browser' && runners[lang.id]) {
      return runners[lang.id](src);
    }
    if (lang.runner === 'piston') {
      const r = await runViaPiston({
        language: lang.piston.language,
        filename: lang.piston.filename,
        code: src,
      });
      return {
        stdout: r.stdout,
        stderr: r.compileError ? `Compile error:\n${r.compileError}` : r.stderr,
      };
    }
    throw new Error(`No runner for language: ${lang.id}`);
  };

  const handleRun = useCallback(async () => {
    setRunning(true);
    setOutput('');
    setError('');
    try {
      const lang = getLanguage(language);
      const { stdout, stderr } = await runViaConfig(lang, code);
      if (stdout) setOutput(stdout);
      if (stderr) setError(stderr);
      if (!stdout && !stderr) setOutput('(no output)');
    } catch (e) {
      setError(e.message);
    } finally {
      setRunning(false);
    }
    // runViaConfig closes over runners which closes over runPython; runPython
    // is stable from usePyodide, and language/code change on every keystroke —
    // depending on them here is correct.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, code, runPython]);

  const handleSave = async () => {
    try {
      await saveSnippet({ language, code, title: language + ' snippet' });
    } catch (e) {
      console.error('Save error:', e);
    }
  };

  const handleLoadSnippets = async () => {
    try {
      const data = await getSnippets();
      setSnippets(data.snippets || data || []);
      setShowSnippets(true);
    } catch (e) {
      console.error('Load snippets error:', e);
    }
  };

  const handleAIReview = async () => {
    setAiReview('');
    try {
      const data = await sendTutorMessage('Review this ' + language + ' code and suggest improvements:\n\n' + code);
      setAiReview(data.reply || data.message || JSON.stringify(data));
    } catch (e) {
      setAiReview('AI review failed: ' + e.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-heading text-text-primary flex items-center gap-2">
          <Code2 className="text-brutal-mint" size={22} /> Code Playground
        </h1>
        <div className="flex items-center gap-2">
          <button onClick={handleLoadSnippets}
            className="px-3 py-1.5 text-xs border-2 border-brutal-black rounded-lg text-text-secondary hover:border-brutal-mint hover:text-brutal-mint flex items-center gap-1">
            <FolderOpen size={12} /> Snippets
          </button>
        </div>
      </div>

      <LanguagePicker active={language} onChange={handleLanguageChange} />

      <div className="grid lg:grid-cols-2 gap-4">
        <BrutalCard className="p-0 overflow-hidden">
          <EditorPanel
            code={code}
            language={getLanguage(language).monaco || language}
            onChange={setCode}
            onRun={handleRun}
            onSave={handleSave}
            onAIReview={handleAIReview}
          />
        </BrutalCard>

        <div className="space-y-4">
          <OutputPanel output={output} error={error} loading={running || pyLoading} />

          {aiReview && (
            <BrutalCard color="purple">
              <h3 className="text-sm text-brutal-purple mb-2">AI Review</h3>
              <p className="text-sm text-text-primary whitespace-pre-wrap">{aiReview}</p>
            </BrutalCard>
          )}
        </div>
      </div>

      {showSnippets && (
        <BrutalCard>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm text-text-secondary">Saved Snippets</h3>
            <button onClick={() => setShowSnippets(false)} className="text-xs text-text-muted hover:text-text-secondary">Close</button>
          </div>
          {snippets.length === 0 ? (
            <p className="text-xs text-text-muted">No saved snippets yet.</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {snippets.map((s, i) => (
                <button key={s._id || i} onClick={() => { setLanguage(s.language); setCode(s.code); setShowSnippets(false); }}
                  className="w-full text-left px-3 py-2 bg-bg-elevated rounded-lg text-xs text-text-secondary hover:text-brutal-mint hover:border-brutal-mint border-2 border-brutal-black transition-colors">
                  <span className="font-mono">{s.language}</span> — {s.title || 'Untitled'}
                </button>
              ))}
            </div>
          )}
        </BrutalCard>
      )}

      {language === 'python' && pyLoading && (
        <p className="text-xs text-brutal-mint animate-pulse text-center">Loading Python runtime (Pyodide)...</p>
      )}
    </div>
  );
}
