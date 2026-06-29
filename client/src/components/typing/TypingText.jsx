/** @fileoverview Styled typing text display - typed chars colored green/red, current char highlighted */

export default function TypingText({ text = '', currentIndex = 0, keypresses = [] }) {
  return (
    <div className="font-mono text-lg leading-relaxed select-none whitespace-pre-wrap break-words w-full overflow-hidden">
      {text.split('').map((char, i) => {
        let cls = 'text-text-muted';
        if (i < currentIndex) {
          const kp = keypresses[i];
          cls = kp?.isCorrect !== false ? 'text-success-text' : 'text-error-text bg-error-muted rounded';
        } else if (i === currentIndex) {
          cls = 'text-text-primary bg-brutal-mint/20 border-b-2 border-brutal-mint animate-pulse';
        }
        return (
          <span key={i} className={cls}>
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      })}
    </div>
  );
}
