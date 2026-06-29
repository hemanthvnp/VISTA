/** @fileoverview Reusable card with neo-brutalist hard shadow effect */
import { forwardRef } from 'react';

const BrutalCard = forwardRef(({ children, className = '', color = 'white', onClick, ...props }, ref) => {
  const bgMap = {
    white: '',
    mint: 'bg-brutal-mint/20',
    purple: 'bg-brutal-purple/10',
    yellow: 'bg-brutal-yellow/20',
    coral: 'bg-brutal-coral/20',
    lavender: 'bg-brutal-lavender/20',
    blue: 'bg-brutal-blue/10',
    orange: 'bg-brutal-orange/10',
    none: '',
  };

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`bg-bg-card border-2 border-brutal-black rounded-lg p-5 shadow-brutal-md hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-150 ${bgMap[color] || ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

BrutalCard.displayName = 'BrutalCard';
export default BrutalCard;
