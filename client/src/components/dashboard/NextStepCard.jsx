import { Sparkles } from 'lucide-react';

/** Next action card - shows Gemini-generated or static suggestion */
export default function NextStepCard({ action, tech }) {
  const defaultAction = `Focus on your ${tech || 'Python'} studies today. Consistency is the key to mastery.`;

  return (
    <div className="brutal-card p-4 border-brutal-purple/30">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={16} className="text-brutal-purple" />
        <span className="text-sm text-text-muted">Next Best Action</span>
      </div>
      <p className="text-sm text-text-primary">{action || defaultAction}</p>
    </div>
  );
}
