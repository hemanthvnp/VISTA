/** Roadmap technology card showing progress and status */
import ResourcesPanel from './ResourcesPanel';

export default function TechCard({ tech, progress, isActive, onSetActive }) {
  const statusColors = {
    'not-started': 'text-text-muted border-border-muted',
    'in-progress': 'text-brutal-blue border-brutal-blue/50',
    'complete': 'text-brutal-mint border-brutal-mint/50',
  };

  const status = progress?.status || 'not-started';
  const pct = progress?.progress || 0;
  const hours = progress?.hoursSpent || 0;

  return (
    <div className={`brutal-card p-4 transition-all ${isActive ? 'border-brutal-mint shadow-brutal-md' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{tech.emoji}</span>
          <div>
            <h3 className="font-semibold text-text-primary">{tech.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded border ${statusColors[status]}`}>
              {status.replace('-', ' ')}
            </span>
          </div>
        </div>
        {!isActive && (
          <button onClick={() => onSetActive(tech.id)} className="btn-brutal text-xs px-3 py-1">
            Set Active
          </button>
        )}
        {isActive && (
          <span className="text-xs text-brutal-mint border border-brutal-mint/50 px-2 py-0.5 rounded">
            ACTIVE
          </span>
        )}
      </div>
      <p className="text-xs text-text-muted mb-3">{tech.description}</p>
      <div className="w-full bg-bg-primary rounded-full h-2 mb-1">
        <div
          className="h-2 rounded-full bg-brutal-mint transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-text-muted">
        <span>{pct}% complete</span>
        <span>{hours.toFixed(1)}h spent</span>
      </div>
      <ResourcesPanel resources={tech.resources} />
    </div>
  );
}
