import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { LANGUAGES, getLanguage } from '../../config/languages';

/**
 * Searchable dropdown picker for playground languages.
 * Replaces the old 3-button strip; scales to any number of entries in languages.js.
 */
export default function LanguagePicker({ active, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  const current = getLanguage(active);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LANGUAGES;
    return LANGUAGES.filter(
      l => l.label.toLowerCase().includes(q) || l.id.toLowerCase().includes(q),
    );
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    else setQuery('');
  }, [open]);

  const pick = (id) => {
    onChange(id);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`px-4 py-1.5 rounded-md text-sm font-medium bg-bg-elevated border transition-all flex items-center gap-2 ${current.color}`}
      >
        {current.label}
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-64 bg-bg-card border-2 border-brutal-black rounded-lg shadow-xl overflow-hidden">
          <div className="p-2 border-b border-brutal-black flex items-center gap-2">
            <Search size={14} className="text-text-muted" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search language..."
              className="flex-1 bg-transparent outline-none text-sm text-text-primary placeholder:text-text-muted"
            />
          </div>
          <div className="max-h-72 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <div className="px-3 py-2 text-xs text-text-muted">No matches</div>
            )}
            {filtered.map((l) => (
              <button
                key={l.id}
                onClick={() => pick(l.id)}
                className={`w-full text-left px-3 py-1.5 text-sm hover:bg-bg-elevated flex items-center justify-between ${
                  l.id === active ? l.color : 'text-text-secondary'
                }`}
              >
                <span>{l.label}</span>
                <span className="text-xs text-text-muted">
                  {l.runner === 'browser' ? 'in-browser' : 'remote'}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
