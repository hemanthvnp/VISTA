/** @fileoverview Timer store - manages study session timer with pause on blur */
import { create } from 'zustand';

const useTimerStore = create((set) => ({
  elapsed: 0,
  isRunning: false,

  start: () => set({ isRunning: true }),
  pause: () => set({ isRunning: false }),
  reset: () => set({ elapsed: 0, isRunning: false }),
  tick: () => set((s) => ({ elapsed: s.elapsed + 1 })),
  setElapsed: (elapsed) => set({ elapsed }),
}));

export default useTimerStore;
