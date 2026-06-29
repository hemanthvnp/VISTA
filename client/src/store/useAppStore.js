/** @fileoverview App store - manages global UI state, active tech, sidebar, gate */
import { create } from 'zustand';

const useAppStore = create((set) => ({
  activeTech: 'python',
  sidebarOpen: true,
  currentPage: 'dashboard',
  showSplash: true,
  showGate: false,
  gateCompleted: false,
  codeRunCount: 0,

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setActiveTech: (tech) => set({ activeTech: tech }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setShowSplash: (show) => set({ showSplash: show }),
  setShowGate: (show) => set({ showGate: show }),
  setGateCompleted: (done) => set({ gateCompleted: done }),
  incrementCodeRun: () => set((s) => ({ codeRunCount: s.codeRunCount + 1 })),
}));

export default useAppStore;
