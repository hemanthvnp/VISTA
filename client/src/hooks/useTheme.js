/** @fileoverview Theme management hook - system-aware dark mode with manual override */
import { useEffect, useCallback } from 'react';
import useAuthStore from '../store/useAuthStore';
import { updateProfile } from '../api/auth';

const STORAGE_KEY = 'codec-theme';

function getSystemPreference() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(resolved) {
  const el = document.documentElement;
  if (resolved === 'dark') {
    el.classList.add('dark');
  } else {
    el.classList.remove('dark');
  }
}

export default function useTheme() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  // Determine the preference: user profile > localStorage > 'system'
  const theme = user?.theme || localStorage.getItem(STORAGE_KEY) || 'system';

  // Resolve 'system' to actual 'light' or 'dark'
  const resolvedTheme = theme === 'system' ? getSystemPreference() : theme;

  // Apply theme class on mount and when it changes
  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  // Listen for system preference changes when mode is 'system'
  useEffect(() => {
    if (theme !== 'system') return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => applyTheme(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = useCallback(async (newTheme) => {
    localStorage.setItem(STORAGE_KEY, newTheme);
    applyTheme(newTheme === 'system' ? getSystemPreference() : newTheme);

    if (user) {
      try {
        await updateProfile({ theme: newTheme });
        updateUser({ theme: newTheme });
      } catch (e) {
        console.error('Failed to save theme preference:', e);
      }
    }
  }, [user, updateUser]);

  return { theme, resolvedTheme, setTheme };
}
