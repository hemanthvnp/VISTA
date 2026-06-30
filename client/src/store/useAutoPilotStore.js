import { create } from 'zustand';

const STORAGE_KEY = 'vanta_autopilot_enabled';

const useAutoPilotStore = create((set, get) => ({
  enabled: localStorage.getItem(STORAGE_KEY) === 'true',
  nextActions: [],
  coachingMessages: [],
  loading: false,

  toggle: () => {
    const next = !get().enabled;
    localStorage.setItem(STORAGE_KEY, String(next));
    set({ enabled: next });
  },

  setEnabled: (val) => {
    localStorage.setItem(STORAGE_KEY, String(val));
    set({ enabled: val });
  },

  setNextActions: (actions) => set({ nextActions: actions }),

  setCoachingMessages: (messages) => set({ coachingMessages: messages }),

  setLoading: (loading) => set({ loading }),

  dismissAction: (actionType) =>
    set((s) => ({ nextActions: s.nextActions.filter((a) => a.type !== actionType) })),

  ackCoachingMessage: (id) =>
    set((s) => ({
      coachingMessages: s.coachingMessages.map((m) =>
        m.id === id ? { ...m, read: true } : m
      ),
    })),

  dismissCoachingMessage: (id) =>
    set((s) => ({ coachingMessages: s.coachingMessages.filter((m) => m.id !== id) })),
}));

export default useAutoPilotStore;
