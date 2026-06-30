import { Zap } from 'lucide-react';

export default function AutoPilotBadge({ className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brutal-mint/20 border border-brutal-mint text-brutal-mint text-xs font-semibold ${className}`}
    >
      <Zap size={10} className="fill-current" />
      AutoPilot
    </span>
  );
}
