import { Youtube, Check, BookOpen, X, ExternalLink, FileText, Play } from 'lucide-react';
import { useState } from 'react';

/** Resolve YouTube URL to embeddable src */
function toYouTubeEmbed(url) {
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${id}`;
  }
  if (url.includes('playlist')) {
    const id = url.split('list=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/videoseries?list=${id}`;
  }
  return url.replace('watch?v=', 'embed/');
}

const TYPE_BADGES = {
  video: 'bg-type-video-bg   text-type-video   border-type-video',
  book: 'bg-type-book-bg  text-type-book  border-type-book',
  course: 'bg-type-course-bg text-type-course border-type-course',
  article: 'bg-type-article-bg text-type-article border-type-article',
  docs: 'bg-brutal-mint/10 text-brutal-mint  border-brutal-mint/30',
};

const TYPE_ICONS = { video: Play, book: BookOpen, course: FileText, docs: FileText, article: FileText };

/** Resource card with in-app viewer - no external-link redirects, no FREE badge */
export default function ResourceCard({ resource, onToggleComplete }) {
  const [viewerOpen, setViewerOpen] = useState(false);

  const isYouTube = resource.url?.includes('youtube.com') || resource.url?.includes('youtu.be');
  // Docs and articles can be iframed; others (Coursera, etc.) need external link fallback
  const canEmbed = isYouTube || resource.type === 'docs' || resource.type === 'article';
  const TypeIcon = TYPE_ICONS[resource.type] || FileText;

  const embedSrc = isYouTube ? toYouTubeEmbed(resource.url) : resource.url;

  return (
    <>
      <div className={`brutal-card p-4 ${resource.completed ? 'border-brutal-mint/40' : ''}`}>
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-text-primary flex-1 pr-2 leading-snug">{resource.title}</h3>
          <button
            onClick={() => onToggleComplete?.(resource)}
            className={`shrink-0 p-1 rounded ${resource.completed ? 'text-brutal-mint' : 'text-text-muted hover:text-text-muted'}`}
            title={resource.completed ? 'Mark incomplete' : 'Mark complete'}
          >
            <Check size={16} />
          </button>
        </div>

        {/* Type + tech badges */}
        <div className="flex gap-2 mb-3 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded border font-medium ${TYPE_BADGES[resource.type] || TYPE_BADGES.docs}`}>
            {resource.type}
          </span>
          {resource.techId && (
            <span className="text-xs px-2 py-0.5 rounded border border-brutal-black text-text-muted">
              {resource.techId}
            </span>
          )}
        </div>

        {resource.description && (
          <p className="text-xs text-text-muted mb-3">{resource.description}</p>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          {isYouTube ? (
            <button
              onClick={() => setViewerOpen(true)}
              className="btn-brutal-purple text-xs px-3 py-1.5 flex items-center gap-1.5"
            >
              <Youtube size={12} /> Watch
            </button>
          ) : canEmbed ? (
            <button
              onClick={() => setViewerOpen(true)}
              className="btn-brutal text-xs px-3 py-1.5 flex items-center gap-1.5"
            >
              <TypeIcon size={12} /> Open in App
            </button>
          ) : (
            // Non-embeddable resources (Coursera, Udemy, etc.) — open externally with clear label
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-brutal text-xs px-3 py-1.5 flex items-center gap-1.5"
            >
              <ExternalLink size={12} /> Visit Resource
            </a>
          )}
        </div>
      </div>

      {/* In-app viewer modal */}
      {viewerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-bg-primary/95 backdrop-blur-sm">
          {/* Modal header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-brutal-black bg-bg-card shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <span className={`text-xs px-2 py-0.5 rounded border ${TYPE_BADGES[resource.type] || TYPE_BADGES.docs}`}>
                {resource.type}
              </span>
              <h2 className="text-sm font-semibold text-text-primary truncate">{resource.title}</h2>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-3">
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-text-muted hover:text-brutal-mint flex items-center gap-1 transition-colors"
              >
                <ExternalLink size={12} /> Open tab
              </a>
              <button
                onClick={() => setViewerOpen(false)}
                className="p-1.5 rounded-lg border border-brutal-black text-text-muted hover:text-brutal-mint hover:border-brutal-mint/40 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Iframe content */}
          <div className="flex-1 overflow-hidden">
            <iframe
              src={embedSrc}
              className="w-full h-full border-0"
              title={resource.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
            />
          </div>
        </div>
      )}
    </>
  );
}

