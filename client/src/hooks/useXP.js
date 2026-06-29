/** @fileoverview XP management hook - awards XP and syncs with backend */
import { useState, useCallback } from 'react';
import { addXP as apiAddXP } from '../api/progress';
import { getMe } from '../api/auth';
import useAuthStore from '../store/useAuthStore';
import { XP_EVENTS } from '../utils/xpCalc';

const useXP = () => {
  const [loading, setLoading] = useState(false);
  const updateUser = useAuthStore((s) => s.updateUser);

  const awardXP = useCallback(async (action, customAmount) => {
    const amount = customAmount || XP_EVENTS[action] || 0;
    if (amount === 0) return null;

    setLoading(true);
    try {
      const result = await apiAddXP(action, amount);
      // Refresh user to get updated XP/level/rank
      const user = await getMe();
      updateUser(user);
      return result;
    } catch (err) {
      console.error('Failed to award XP:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateUser]);

  return { awardXP, loading, XP_EVENTS };
};

export default useXP;
