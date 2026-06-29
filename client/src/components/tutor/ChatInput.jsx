import { useState } from 'react';
import { Send } from 'lucide-react';

/** Chat input area with send button for AI Tutor */
export default function ChatInput({ onSend, loading, suggestedPrompts = [] }) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim() || loading) return;
    onSend(input.trim());
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-brutal-black bg-bg-card p-4">
      {suggestedPrompts.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestedPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => onSend(prompt)}
              className="text-xs px-3 py-1.5 rounded-full border border-brutal-black text-text-muted hover:border-brutal-purple hover:text-brutal-purple transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your tutor anything..."
          rows={1}
          className="flex-1 bg-bg-primary border border-brutal-black rounded-lg px-4 py-2.5 text-sm text-text-primary resize-none focus:outline-none focus:border-brutal-purple"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="btn-brutal-purple px-4 disabled:opacity-50"
        >
          {loading ? <span className="animate-pulse">...</span> : <Send size={16} />}
        </button>
      </div>
    </div>
  );
}
