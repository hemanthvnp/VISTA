/** @fileoverview Date/time utility functions for VANTA */

/** Returns today as 'YYYY-MM-DD' string */
export const getTodayString = () => new Date().toISOString().split('T')[0];

/** Format seconds into 'Xh Ym' display string */
export const formatDuration = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
};

/** Format seconds into 'MM:SS' timer display */
export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

/** Check if a date string matches today */
export const isToday = (dateString) => dateString === getTodayString();

/** Days between a date string and today */
export const getDaysSince = (dateString) => {
  if (!dateString) return Infinity;
  const then = new Date(dateString);
  const now = new Date();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
};

/** Determine streak tier: 'bronze' (typing only), 'silver' (learning only), 'gold' (both) */
export const getStreakType = (gateComplete, studyMinutes) => {
  if (gateComplete && studyMinutes >= 15) return 'gold';
  if (gateComplete) return 'bronze';
  if (studyMinutes >= 15) return 'silver';
  return '';
};

/** Format a date into relative time string */
export const formatRelativeTime = (date) => {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now - d;
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
};

/** Get day-of-year modulo 3 for gate content rotation: 0=words, 1=code, 2=sentences */
export const getGateDayMode = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  const modes = ['words', 'code', 'sentences'];
  return modes[dayOfYear % 3];
};
