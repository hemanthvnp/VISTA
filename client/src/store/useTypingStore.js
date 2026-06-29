/** @fileoverview Typing store - manages typing sessions, lessons, ML data */
import { create } from 'zustand';

const useTypingStore = create((set) => ({
  currentSession: null,
  sessionHistory: [],
  stats: null,
  mlReport: null,
  geminiAdvice: null,
  currentLevel: 1,
  activeTab: 'practice',

  setCurrentSession: (session) => set({ currentSession: session }),
  setSessionHistory: (history) => set({ sessionHistory: history }),
  setStats: (stats) => set({ stats }),
  setMlReport: (report) => set({ mlReport: report }),
  setGeminiAdvice: (advice) => set({ geminiAdvice: advice }),
  setCurrentLevel: (level) => set({ currentLevel: level }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  addKeypress: (keypress) => set((state) => ({
    currentSession: state.currentSession
      ? { ...state.currentSession, keypresses: [...(state.currentSession.keypresses || []), keypress] }
      : null,
  })),

  endSession: () => set({ currentSession: null }),
}));

export default useTypingStore;
