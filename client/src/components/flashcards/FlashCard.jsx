import { useState } from 'react';

/** Flashcard with 3D CSS flip animation */
export default function FlashCard({ card, onResponse }) {
  const [flipped, setFlipped] = useState(false);

  if (!card) return null;

  return (
    <div className="perspective-1000 w-full max-w-lg mx-auto" style={{ perspective: '1000px' }}>
      <div
        onClick={() => setFlipped(!flipped)}
        className="relative w-full cursor-pointer transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          minHeight: '250px',
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 brutal-card p-6 flex flex-col justify-center items-center text-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-xs text-text-muted mb-2 uppercase">{card.techId} — {card.difficulty}</span>
          <p className="text-lg text-text-primary font-medium">{card.front}</p>
          <span className="text-xs text-text-muted mt-4">Click to flip</span>
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 brutal-card p-6 flex flex-col justify-center items-center text-center border-brutal-purple/30"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <span className="text-xs text-brutal-purple mb-2">ANSWER</span>
          <p className="text-sm text-text-secondary font-mono leading-relaxed whitespace-pre-wrap">{card.back}</p>
        </div>
      </div>
      {flipped && (
        <div className="flex justify-center gap-3 mt-4 animate-fade-in">
          <button
            onClick={() => { setFlipped(false); onResponse?.('got-it'); }}
            className="px-4 py-2 rounded-lg bg-brutal-mint/20 border border-brutal-mint text-brutal-mint text-sm hover:bg-brutal-mint/30"
          >
            Got It ✓
          </button>
          <button
            onClick={() => { setFlipped(false); onResponse?.('learning'); }}
            className="px-4 py-2 rounded-lg bg-bg-elevated border border-brutal-black/30 text-text-muted text-sm hover:bg-bg-elevated/80"
          >
            Still Learning
          </button>
          <button
            onClick={() => { setFlipped(false); onResponse?.('hard'); }}
            className="px-4 py-2 rounded-lg bg-brutal-pink/20 border border-brutal-pink text-brutal-pink text-sm hover:bg-brutal-pink/30"
          >
            Hard ✗
          </button>
        </div>
      )}
    </div>
  );
}
