import { Zap } from 'lucide-react';
import useAutoPilot from '../../hooks/useAutoPilot';
import useAutoPilotStore from '../../store/useAutoPilotStore';

export default function AutoPilotToggle({ compact = false }) {
  const enabled = useAutoPilotStore((s) => s.enabled);
  const { handleToggle } = useAutoPilot();

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 border-brutal-black font-semibold text-sm transition-all duration-150 shadow-brutal-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 ${
        enabled
          ? 'bg-brutal-mint text-brutal-black'
          : 'bg-bg-card text-text-secondary'
      }`}
      title={enabled ? 'AutoPilot is ON — click to disable' : 'Enable AutoPilot'}
    >
      <Zap size={14} className={enabled ? 'fill-current' : ''} />
      {!compact && <span>AutoPilot {enabled ? 'ON' : 'OFF'}</span>}
    </button>
  );
}
