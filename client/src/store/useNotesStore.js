/** @fileoverview Notes store - manages per-technology notes cache */
import { create } from 'zustand';

const useNotesStore = create((set, get) => ({
  currentTechId: 'python',
  notes: {},

  setCurrentTech: (techId) => set({ currentTechId: techId }),

  setNoteContent: (techId, content) => set((state) => ({
    notes: { ...state.notes, [techId]: content },
  })),

  getNoteContent: (techId) => get().notes[techId] || '',
}));

export default useNotesStore;
