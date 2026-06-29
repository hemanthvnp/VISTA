/** @fileoverview Expandable resources panel for each TechCard on the Roadmap */
import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

const TYPE_CONFIG = {
    docs: { label: 'Docs', color: 'text-brutal-mint   border-brutal-mint/40   bg-brutal-mint/10' },
    video: { label: 'Video', color: 'text-brutal-pink border-brutal-pink/40 bg-brutal-pink/10' },
    course: { label: 'Course', color: 'text-brutal-yellow   border-brutal-yellow/40   bg-brutal-yellow/10' },
    book: { label: 'Book', color: 'text-brutal-purple  border-brutal-purple/40  bg-brutal-purple/10' },
};

export default function ResourcesPanel({ resources = [] }) {
    const [open, setOpen] = useState(false);

    if (!resources.length) return null;

    return (
        <div className="mt-3 border-t border-brutal-black pt-3">
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-1.5 text-xs text-text-muted hover:text-brutal-mint transition-colors w-full"
            >
                <BookOpen size={13} />
                <span className="font-medium">Resources ({resources.length})</span>
                <span className="ml-auto">
                    {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </span>
            </button>

            {open && (
                <ul className="mt-2 space-y-1.5 animate-slide-in">
                    {resources.map((r, i) => {
                        const cfg = TYPE_CONFIG[r.type] || TYPE_CONFIG.docs;
                        return (
                            <li key={i}>
                                <a
                                    href={r.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-xs text-text-secondary hover:text-text-primary transition-colors group"
                                >
                                    <span
                                        className={`shrink-0 px-1.5 py-0.5 rounded border text-[10px] font-mono font-semibold ${cfg.color}`}
                                    >
                                        {cfg.label}
                                    </span>
                                    <span className="truncate group-hover:underline">{r.title}</span>
                                </a>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
