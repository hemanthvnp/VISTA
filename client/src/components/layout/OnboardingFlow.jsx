/** @fileoverview First-time user onboarding - 3-step setup survey */
import { useState } from 'react';
import { Zap } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useAppStore from '../../store/useAppStore';
import { updateProfile } from '../../api/auth';

const TECHS = [
  { id: 'python', name: 'Python', emoji: '\u{1F40D}' },
  { id: 'cpp', name: 'C++', emoji: '\u{2699}\u{FE0F}' },
  { id: 'ue5', name: 'Unreal Engine 5', emoji: '\u{1F3AE}' },
  { id: 'blender', name: 'Blender', emoji: '\u{1F3A8}' },
  { id: 'git', name: 'Git', emoji: '\u{1F4C2}' },
  { id: 'pytorch', name: 'PyTorch', emoji: '\u{1F525}' },
  { id: 'rl-ppo', name: 'RL / PPO', emoji: '\u{1F916}' },
  { id: 'zeromq', name: 'ZeroMQ', emoji: '\u{1F4E1}' },
  { id: 'fastapi', name: 'FastAPI', emoji: '\u{1F680}' },
  { id: 'federated-learning', name: 'Federated Learning', emoji: '\u{1F310}' },
];

export default function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(0);
  const [typingLevel, setTypingLevel] = useState('beginner');
  const [startingTech, setStartingTech] = useState('python');
  const [weeklyHours, setWeeklyHours] = useState(3);
  const [saving, setSaving] = useState(false);
  const updateUser = useAuthStore((s) => s.updateUser);
  const setActiveTech = useAppStore((s) => s.setActiveTech);

  const handleFinish = async () => {
    setSaving(true);
    try {
      await updateProfile({
        activeTechId: startingTech,
        weeklyHourTarget: weeklyHours,
        onboardingComplete: true,
      });
      updateUser({ activeTechId: startingTech, weeklyHourTarget: weeklyHours, onboardingComplete: true });
      setActiveTech(startingTech);
      if (onComplete) onComplete();
    } catch (e) {
      console.error('Onboarding save failed:', e);
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-bg-primary z-50 flex items-center justify-center">
      <div className="max-w-lg w-full mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Zap className="w-12 h-12 text-brutal-mint mx-auto mb-3" />
          <h1 className="text-2xl font-heading font-bold text-text-primary">Welcome, Trainee NPC</h1>
          <p className="text-text-secondary mt-1">Let's set you up.</p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-brutal-mint w-6' : i < step ? 'bg-brutal-purple/50' : 'bg-brutal-black/20'}`} />
          ))}
        </div>

        <div className="bg-bg-card border-2 border-brutal-black rounded-lg shadow-brutal-lg p-6">
          {/* Step 0: Typing speed */}
          {step === 0 && (
            <div>
              <h2 className="text-lg font-heading text-text-primary mb-4">What's your current typing speed?</h2>
              {['beginner', 'intermediate', 'advanced'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setTypingLevel(lvl)}
                  className={`w-full p-3 rounded-lg border-2 mb-2 text-left capitalize transition-all ${
                    typingLevel === lvl
                      ? 'border-brutal-black bg-brutal-yellow text-text-primary shadow-brutal-sm font-semibold'
                      : 'border-border-muted text-text-secondary hover:border-brutal-black'
                  }`}
                >
                  {lvl === 'beginner' && 'Beginner (< 30 WPM)'}
                  {lvl === 'intermediate' && 'Intermediate (30-60 WPM)'}
                  {lvl === 'advanced' && 'Advanced (60+ WPM)'}
                </button>
              ))}
            </div>
          )}

          {/* Step 1: Starting technology */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-heading text-text-primary mb-4">Which technology to start with?</h2>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {TECHS.map((tech) => (
                  <button
                    key={tech.id}
                    onClick={() => setStartingTech(tech.id)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      startingTech === tech.id
                        ? 'border-brutal-black bg-brutal-yellow text-text-primary shadow-brutal-sm font-semibold'
                        : 'border-border-muted text-text-secondary hover:border-brutal-black'
                    }`}
                  >
                    <span className="mr-2">{tech.emoji}</span>
                    <span className="text-sm">{tech.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Weekly hours */}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-heading text-text-primary mb-4">Hours per week available?</h2>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(Number(e.target.value))}
                  className="flex-1 accent-brutal-purple"
                />
                <span className="text-2xl font-mono text-brutal-purple w-16 text-right">{weeklyHours}h</span>
              </div>
              <p className="text-xs text-text-muted mt-2">You can change this anytime in Settings</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            {step > 0 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Back
              </button>
            ) : <div />}

            {step < 2 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-6 py-2 bg-brutal-mint text-text-primary border-2 border-brutal-black rounded-lg text-sm font-semibold shadow-brutal-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={saving}
                className="px-6 py-2 bg-brutal-purple text-white border-2 border-brutal-black rounded-lg text-sm font-bold shadow-brutal-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Begin Journey'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
