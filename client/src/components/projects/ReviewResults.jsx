import { Trophy, ThumbsUp, AlertCircle, Briefcase, Edit3, RefreshCw, Github, Link2 } from 'lucide-react';
import BrutalCard from '../ui/BrutalCard';

function scoreColor(score) {
  if (score >= 85) return 'text-brutal-mint';
  if (score >= 70) return 'text-brutal-yellow';
  if (score >= 50) return 'text-brutal-purple';
  return 'text-brutal-coral';
}

export default function ReviewResults({ submission, xpAwarded, onEdit, onRetryReview, retrying }) {
  if (!submission) return null;

  const {
    repoUrl, demoUrl, score, description, strengths, keyMistakes,
    professionalismFeedback, reviewFailed, attemptCount,
  } = submission;

  return (
    <div className="space-y-3">
      {xpAwarded > 0 && (
        <div className="flex items-center gap-2 text-sm text-brutal-mint font-semibold">
          <Trophy size={16} /> +{xpAwarded} XP earned!
        </div>
      )}

      <div className="flex items-center gap-4 text-xs text-text-muted">
        <a href={repoUrl.startsWith('http') ? repoUrl : `https://${repoUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-text-secondary">
          <Github size={13} /> Repository
        </a>
        {demoUrl && (
          <a href={demoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-text-secondary">
            <Link2 size={13} /> Live Demo
          </a>
        )}
        <span>Attempt {attemptCount}</span>
      </div>

      {reviewFailed ? (
        <BrutalCard className="text-center py-6">
          <AlertCircle size={24} className="text-brutal-yellow mx-auto mb-2" />
          <p className="text-sm text-text-primary mb-1">Your submission was validated, but AI review couldn't be completed.</p>
          <p className="text-xs text-text-muted mb-3">This can happen occasionally — try again.</p>
          <button
            onClick={onRetryReview}
            disabled={retrying}
            className="px-4 py-2 bg-brutal-purple text-white border-2 border-brutal-black rounded-lg text-sm font-semibold inline-flex items-center gap-2 hover:bg-brutal-purple/90 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={retrying ? 'animate-spin' : ''} /> Retry Review
          </button>
        </BrutalCard>
      ) : (
        <>
          <div className="flex items-center gap-4">
            <div className={`text-4xl font-mono font-bold ${scoreColor(score)}`}>{score}</div>
            <div className="flex-1">
              <div className="h-2 rounded-full bg-bg-elevated border border-brutal-black overflow-hidden">
                <div className={`h-full ${scoreColor(score).replace('text-', 'bg-')}`} style={{ width: `${score}%` }} />
              </div>
              <p className="text-xs text-text-muted mt-1">Quality Score / 100</p>
            </div>
          </div>

          <BrutalCard color="purple">
            <p className="text-sm text-text-secondary italic">{description}</p>
          </BrutalCard>

          <BrutalCard color="mint">
            <h4 className="text-xs font-bold uppercase tracking-wide text-success-text flex items-center gap-1.5 mb-2">
              <ThumbsUp size={13} /> Strengths
            </h4>
            <p className="text-sm text-text-secondary whitespace-pre-line">{strengths}</p>
          </BrutalCard>

          <BrutalCard color="coral">
            <h4 className="text-xs font-bold uppercase tracking-wide text-brutal-coral flex items-center gap-1.5 mb-2">
              <AlertCircle size={13} /> Key Mistakes
            </h4>
            <p className="text-sm text-text-secondary whitespace-pre-line">{keyMistakes}</p>
          </BrutalCard>

          <BrutalCard color="yellow">
            <h4 className="text-xs font-bold uppercase tracking-wide text-text-primary flex items-center gap-1.5 mb-2">
              <Briefcase size={13} /> Professionalism Feedback
            </h4>
            <p className="text-sm text-text-secondary whitespace-pre-line">{professionalismFeedback}</p>
          </BrutalCard>
        </>
      )}

      <button
        onClick={onEdit}
        className="w-full px-4 py-2 border-2 border-brutal-black rounded-lg text-sm text-text-secondary flex items-center justify-center gap-2 hover:bg-bg-elevated transition-colors"
      >
        <Edit3 size={14} /> Edit &amp; Resubmit
      </button>
    </div>
  );
}
