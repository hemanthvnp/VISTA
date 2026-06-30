import { Zap, CheckCircle } from 'lucide-react';
import useAutoPilotStore from '../../store/useAutoPilotStore';
import useAutoPilot from '../../hooks/useAutoPilot';
import ActionCard from './ActionCard';
import BrutalCard from '../ui/BrutalCard';

function SkeletonCard() {
  return (
    <div className="rounded-lg border-2 border-brutal-black p-5 shadow-brutal-md bg-bg-card animate-pulse">
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-lg bg-bg-hover flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-bg-hover rounded w-24" />
          <div className="h-4 bg-bg-hover rounded w-3/4" />
        </div>
        <div className="w-16 h-8 rounded-lg bg-bg-hover flex-shrink-0" />
      </div>
    </div>
  );
}

export default function AutoPilotDashboard() {
  const { nextActions, loading } = useAutoPilotStore();
  const { handleDismissAction } = useAutoPilot();

  if (loading) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-heading text-text-secondary flex items-center gap-2">
          <Zap size={14} className="text-brutal-mint fill-current" />
          AutoPilot — loading your queue...
        </h3>
        {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (nextActions.length === 0) {
    return (
      <BrutalCard className="text-center py-8">
        <CheckCircle size={28} className="text-brutal-mint mx-auto mb-3" />
        <p className="font-heading text-text-primary mb-1">You're all caught up!</p>
        <p className="text-sm text-text-muted">No actions queued. Head to Typing for a free session.</p>
      </BrutalCard>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-heading text-text-secondary flex items-center gap-2">
        <Zap size={14} className="text-brutal-mint fill-current" />
        AutoPilot — what V wants you to do
      </h3>
      {nextActions.map((action) => (
        <ActionCard key={action.id} action={action} onDismiss={handleDismissAction} />
      ))}
    </div>
  );
}
