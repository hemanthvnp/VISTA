/** @fileoverview Mini Projects page - student-managed GitHub submissions + AI code review */
import { useState, useEffect, useCallback } from 'react';
import BrutalCard from '../components/ui/BrutalCard';
import { submitProject, getSubmissions, deleteSubmission } from '../api/projects';
import SubmissionForm from '../components/projects/SubmissionForm';
import ReviewResults from '../components/projects/ReviewResults';
import { FolderGit2, ChevronDown, ChevronUp, CheckCircle2, Plus, Trash2, X } from 'lucide-react';

export default function MiniProjects() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null); // 'new' | submission._id | null
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [lastXp, setLastXp] = useState({});

  useEffect(() => {
    getSubmissions()
      .then((list) => setSubmissions(Array.isArray(list) ? list : []))
      .catch((e) => console.error('Failed to load project submissions:', e))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = useCallback(async (submissionId, values) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await submitProject({ submissionId: submissionId === 'new' ? undefined : submissionId, ...values });
      setSubmissions((prev) => {
        const exists = prev.some((s) => s._id === result.submission._id);
        return exists
          ? prev.map((s) => (s._id === result.submission._id ? result.submission : s))
          : [result.submission, ...prev];
      });
      setLastXp((prev) => ({ ...prev, [result.submission._id]: result.xpAwarded }));
      setEditingId(null);
      setExpandedId(result.submission._id);
    } catch (e) {
      setSubmitError(e);
    } finally {
      setSubmitting(false);
    }
  }, []);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Remove this project? This cannot be undone.')) return;
    try {
      await deleteSubmission(id);
      setSubmissions((prev) => prev.filter((s) => s._id !== id));
      setExpandedId((prev) => (prev === id ? null : prev));
    } catch (e) {
      console.error('Failed to delete project:', e);
    }
  }, []);

  const totalXp = submissions.reduce((sum, s) => sum + (s.xpAwarded || 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-heading text-text-primary flex items-center gap-2">
          <FolderGit2 className="text-brutal-mint" size={22} /> Mini Projects
        </h1>
        <button
          onClick={() => { setEditingId('new'); setExpandedId('new'); setSubmitError(null); }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-brutal-yellow text-text-primary border-2 border-brutal-black rounded-lg text-sm font-semibold hover:bg-brutal-yellow/80 transition-colors"
        >
          <Plus size={15} /> Add Project
        </button>
      </div>

      <p className="text-sm text-text-muted">
        Submit your own GitHub projects. We validate it's genuine work, then an AI reviews your code for quality, mistakes, and professionalism.
        {submissions.length > 0 && (
          <span className="text-brutal-yellow font-mono ml-1">
            {submissions.length} project{submissions.length === 1 ? '' : 's'} · {totalXp} XP earned
          </span>
        )}
      </p>

      {editingId === 'new' && (
        <BrutalCard color="cyan">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-text-primary">New Project</h3>
            <button onClick={() => setEditingId(null)} className="text-text-muted hover:text-text-primary">
              <X size={16} />
            </button>
          </div>
          <SubmissionForm
            onSubmit={(values) => handleSubmit('new', values)}
            loading={submitting}
            error={submitError}
            submitLabel="Submit for Review"
          />
        </BrutalCard>
      )}

      <div className="space-y-3">
        {submissions.map((submission) => {
          const isExpanded = expandedId === submission._id;
          const isEditing = editingId === submission._id;

          return (
            <BrutalCard key={submission._id} color={!submission.reviewFailed ? 'mint' : 'cyan'}>
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : submission._id)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FolderGit2 size={18} className="text-text-muted flex-shrink-0" />
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2 truncate">
                      {submission.title}
                      {!submission.reviewFailed && <CheckCircle2 size={14} className="text-success-text flex-shrink-0" />}
                    </h3>
                    <p className="text-xs text-text-muted truncate">{submission.repoUrl}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {!submission.reviewFailed && (
                    <span className="text-xs font-mono text-brutal-yellow">{submission.score}/100</span>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(submission._id); }}
                    className="text-text-muted hover:text-brutal-coral transition-colors"
                    title="Remove project"
                  >
                    <Trash2 size={14} />
                  </button>
                  {isExpanded ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 border-t border-brutal-black pt-3">
                  {isEditing ? (
                    <SubmissionForm
                      initialValues={submission}
                      onSubmit={(values) => handleSubmit(submission._id, values)}
                      loading={submitting}
                      error={submitError}
                      submitLabel="Resubmit for Review"
                    />
                  ) : (
                    <ReviewResults
                      submission={submission}
                      xpAwarded={lastXp[submission._id] || 0}
                      onEdit={() => { setEditingId(submission._id); setSubmitError(null); }}
                      onRetryReview={() => handleSubmit(submission._id, submission)}
                      retrying={submitting}
                    />
                  )}
                </div>
              )}
            </BrutalCard>
          );
        })}
      </div>

      {!loading && submissions.length === 0 && editingId !== 'new' && (
        <BrutalCard className="text-center py-8">
          <p className="text-text-muted text-sm mb-3">No projects yet — add your first GitHub project to get started!</p>
          <button
            onClick={() => { setEditingId('new'); setExpandedId('new'); }}
            className="px-4 py-2 bg-brutal-yellow text-text-primary border-2 border-brutal-black rounded-lg text-sm font-semibold inline-flex items-center gap-2 hover:bg-brutal-yellow/80 transition-colors"
          >
            <Plus size={15} /> Add Project
          </button>
        </BrutalCard>
      )}
    </div>
  );
}
