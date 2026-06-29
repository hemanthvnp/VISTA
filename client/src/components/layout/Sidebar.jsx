/** @fileoverview Navigation sidebar with page links, rank display, and collapse toggle */
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import useAppStore from '../../store/useAppStore';
import { getRankFromXP, RANK_EMOJIS, getLevelFromXP } from '../../utils/xpCalc';
import {
  LayoutDashboard, Keyboard, Map, BookOpen, Code2, Brain,
  MessageSquare, Calendar, StickyNote, Hammer, Trophy, Settings,
  ChevronLeft, ChevronRight, Zap, GraduationCap,
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/typing', label: 'Typing', icon: Keyboard },
  { path: '/roadmap', label: 'Roadmap', icon: Map },
  { path: '/resources', label: 'Resources', icon: BookOpen },
  { path: '/learn', label: 'Learn', icon: GraduationCap },
  { path: '/code', label: 'Code Playground', icon: Code2 },
  { path: '/flashcards', label: 'Flashcards', icon: Brain },
  { path: '/tutor', label: 'AI Tutor', icon: MessageSquare },
  { path: '/schedule', label: 'Schedule', icon: Calendar },
  { path: '/notes', label: 'Notes', icon: StickyNote },
  { path: '/projects', label: 'Mini Projects', icon: Hammer },
  { path: '/achievements', label: 'Achievements', icon: Trophy },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const user = useAuthStore((s) => s.user);
  const xp = user?.xp || 0;
  const level = getLevelFromXP(xp);
  const rank = getRankFromXP(xp);
  const emoji = RANK_EMOJIS[level - 1];

  return (
    <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} bg-bg-card border-r-2 border-brutal-black flex flex-col transition-all duration-300 h-screen sticky top-0`}>
      {/* Logo */}
      <div className="p-4 flex items-center gap-2 border-b-2 border-brutal-black">
        <Zap className="text-brutal-purple w-6 h-6 flex-shrink-0" />
        {sidebarOpen && (
          <span className="font-heading text-brutal-purple font-bold text-lg tracking-wider">V</span>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto py-2 sidebar-scroll">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 mx-2 text-sm transition-all duration-150
              ${isActive
                ? 'bg-brutal-yellow dark:bg-white/10 text-text-primary border-2 border-brutal-black shadow-[3px_3px_0px_var(--shadow-color)] font-semibold translate-x-[1px] translate-y-[1px]'
                : 'text-text-secondary border-2 border-transparent hover:border-brutal-black dark:hover:border-brutal-black hover:bg-bg-elevated dark:hover:bg-white/5 hover:shadow-[3px_3px_0px_var(--shadow-color)] hover:text-text-primary hover:-translate-x-[1px] hover:-translate-y-[1px]'
              }`
            }
            end={path === '/'}
          >
            <Icon size={18} className="flex-shrink-0" />
            {sidebarOpen && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Rank display */}
      {sidebarOpen && user && (
        <div className="p-4 border-t-2 border-brutal-black">
          <div className="text-center">
            <span className="text-xl">{emoji}</span>
            <p className="text-xs text-brutal-yellow mt-1 font-heading">{rank}</p>
            <p className="text-xs text-brutal-yellow font-heading mt-0.5">Lvl {level}</p>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="p-3 border-t-2 border-brutal-black text-text-muted hover:text-text-primary transition-colors"
      >
        {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>
    </aside>
  );
}
