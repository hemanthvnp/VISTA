import Editor from '@monaco-editor/react';
import useTheme from '../../hooks/useTheme';

/** Monaco code editor panel with language selection */
export default function EditorPanel({ code, language, onChange, onRun, onSave, onAIReview }) {
  const { resolvedTheme } = useTheme();
  const langConfig = {
    python: { monacoLang: 'python', color: 'text-brutal-mint' },
    javascript: { monacoLang: 'javascript', color: 'text-brutal-yellow' },
    cpp: { monacoLang: 'cpp', color: 'text-brutal-blue' },
  };

  const config = langConfig[language] || langConfig.python;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2 bg-bg-elevated border-b border-brutal-black">
        <span className={`text-sm font-mono font-medium ${config.color}`}>{language}</span>
        <div className="flex gap-2">
          <button onClick={onRun} className="btn-brutal text-xs px-3 py-1">▶ Run</button>
          <button onClick={onAIReview} className="btn-brutal-purple text-xs px-3 py-1">AI Review</button>
          <button onClick={onSave} className="text-xs px-3 py-1 text-text-muted border border-brutal-black rounded hover:border-brutal-mint hover:text-brutal-mint transition-colors">Save</button>
        </div>
      </div>
      <div className="flex-1 min-h-[300px]">
        <Editor
          height="100%"
          language={config.monacoLang}
          value={code}
          onChange={onChange}
          theme={resolvedTheme === 'dark' ? 'vs-dark' : 'vs'}
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', monospace",
            minimap: { enabled: false },
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 12 },
          }}
        />
      </div>
    </div>
  );
}
