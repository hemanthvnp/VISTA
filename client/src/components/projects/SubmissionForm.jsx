import { useState } from 'react';
import { FolderGit2, Github, Link2, FileText, Send } from 'lucide-react';
import ValidationError from './ValidationError';

export default function SubmissionForm({ initialValues, onSubmit, loading, error, submitLabel = 'Submit for Review' }) {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [repoUrl, setRepoUrl] = useState(initialValues?.repoUrl || '');
  const [githubUsername, setGithubUsername] = useState(initialValues?.githubUsername || '');
  const [demoUrl, setDemoUrl] = useState(initialValues?.demoUrl || '');
  const [notes, setNotes] = useState(initialValues?.notes || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    onSubmit({ title, repoUrl, githubUsername, demoUrl, notes });
  };

  const fieldError = (field) => error?.payload?.field === field ? error.payload.message : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="text-xs text-text-muted flex items-center gap-1.5 mb-1">
          <FolderGit2 size={13} /> Project Title <span className="text-brutal-coral">*</span>
        </label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My Awesome Project"
          className={`w-full bg-bg-card border-2 rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none ${
            fieldError('title') ? 'border-brutal-coral' : 'border-brutal-black focus:border-brutal-purple'
          }`}
        />
        {fieldError('title') && <p className="text-xs text-brutal-coral mt-1">{fieldError('title')}</p>}
      </div>

      <div>
        <label className="text-xs text-text-muted flex items-center gap-1.5 mb-1">
          <Github size={13} /> GitHub Repository URL <span className="text-brutal-coral">*</span>
        </label>
        <input
          required
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="github.com/yourname/your-project"
          className={`w-full bg-bg-card border-2 rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none ${
            fieldError('repoUrl') ? 'border-brutal-coral' : 'border-brutal-black focus:border-brutal-purple'
          }`}
        />
        {fieldError('repoUrl') && <p className="text-xs text-brutal-coral mt-1">{fieldError('repoUrl')}</p>}
      </div>

      <div>
        <label className="text-xs text-text-muted flex items-center gap-1.5 mb-1">
          Your GitHub Username <span className="text-brutal-coral">*</span>
        </label>
        <input
          required
          value={githubUsername}
          onChange={(e) => setGithubUsername(e.target.value)}
          placeholder="yourname"
          className={`w-full bg-bg-card border-2 rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none ${
            fieldError('githubUsername') ? 'border-brutal-coral' : 'border-brutal-black focus:border-brutal-purple'
          }`}
        />
        {fieldError('githubUsername') && <p className="text-xs text-brutal-coral mt-1">{fieldError('githubUsername')}</p>}
      </div>

      <div>
        <label className="text-xs text-text-muted flex items-center gap-1.5 mb-1">
          <Link2 size={13} /> Live Demo URL <span className="text-text-muted">(optional)</span>
        </label>
        <input
          value={demoUrl}
          onChange={(e) => setDemoUrl(e.target.value)}
          placeholder="https://your-demo.app"
          className="w-full bg-bg-card border-2 border-brutal-black rounded-lg px-3 py-2 text-text-primary text-sm focus:border-brutal-purple focus:outline-none"
        />
      </div>

      <div>
        <label className="text-xs text-text-muted flex items-center gap-1.5 mb-1">
          <FileText size={13} /> Notes for Reviewer <span className="text-text-muted">(optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Anything you want the reviewer to know..."
          className="w-full bg-bg-card border-2 border-brutal-black rounded-lg px-3 py-2 text-text-primary text-sm focus:border-brutal-purple focus:outline-none resize-none"
        />
      </div>

      {error && !fieldError('title') && !fieldError('repoUrl') && !fieldError('githubUsername') && <ValidationError error={error} />}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2.5 bg-brutal-yellow text-text-primary border-2 border-brutal-black rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-brutal-yellow/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-text-primary border-t-transparent rounded-full animate-spin" />
            Validating &amp; Reviewing...
          </>
        ) : (
          <>
            <Send size={15} /> {submitLabel}
          </>
        )}
      </button>
    </form>
  );
}
