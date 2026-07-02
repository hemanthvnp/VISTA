import { ExternalLink, Share2 } from 'lucide-react';
import BrutalCard from '../ui/BrutalCard';

const PLATFORMS = [
  { name: 'Medium',   url: 'https://medium.com/new-story',    hint: 'Paste your exported .md',   color: 'text-text-secondary' },
  { name: 'Hashnode', url: 'https://hashnode.com/start-writing', hint: 'Native markdown support', color: 'text-brutal-blue'    },
  { name: 'dev.to',   url: 'https://dev.to/new',              hint: 'Great for dev content',     color: 'text-brutal-mint'    },
];

export default function PublishRecommendation({ qualityScore, onExport }) {
  const ready = qualityScore != null && qualityScore >= 70;

  return (
    <BrutalCard>
      <h4 className="text-sm font-semibold text-text-primary mb-1 flex items-center gap-2">
        <Share2 size={14} className="text-brutal-yellow" /> Share Your Notes
      </h4>
      <p className="text-xs text-text-muted mb-3 leading-relaxed">
        {ready
          ? 'Your notes are publish-ready. Export as Markdown and paste into any platform below.'
          : 'Run a quality check and reach 70+ to make your notes publish-ready.'}
      </p>

      <button
        onClick={onExport}
        className="w-full mb-3 px-3 py-2 border-2 border-brutal-black rounded-lg text-xs font-semibold text-text-secondary hover:border-brutal-yellow hover:text-brutal-yellow transition-colors"
      >
        Export .md
      </button>

      <div className="space-y-2">
        {PLATFORMS.map(p => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg border border-brutal-black/40 hover:border-brutal-purple/50 transition-colors group"
          >
            <div>
              <span className={`text-xs font-semibold ${p.color}`}>{p.name}</span>
              <p className="text-[10px] text-text-muted">{p.hint}</p>
            </div>
            <ExternalLink size={11} className="text-text-muted group-hover:text-brutal-purple transition-colors" />
          </a>
        ))}
      </div>
    </BrutalCard>
  );
}
