import { AlertTriangle } from 'lucide-react';

export default function ValidationError({ error }) {
  if (!error) return null;

  const isApiError = error.payload?.type === 'github_api';
  const message = error.payload?.message || error.message || 'Something went wrong.';

  return (
    <div className={`flex items-start gap-2 p-3 rounded-lg border-2 text-sm ${
      isApiError
        ? 'border-brutal-yellow bg-brutal-yellow/10 text-text-primary'
        : 'border-brutal-coral bg-brutal-coral/10 text-text-primary'
    }`}>
      <AlertTriangle size={16} className={isApiError ? 'text-brutal-yellow flex-shrink-0 mt-0.5' : 'text-brutal-coral flex-shrink-0 mt-0.5'} />
      <div>
        <p>{message}</p>
        {isApiError && <p className="text-xs text-text-muted mt-1">This isn't your fault — please try submitting again in a moment.</p>}
      </div>
    </div>
  );
}
