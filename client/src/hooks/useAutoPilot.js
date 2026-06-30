import { useEffect, useCallback } from 'react';
import useAutoPilotStore from '../store/useAutoPilotStore';
import useNotifications from './useNotifications';
import * as api from '../api/autopilot';

export default function useAutoPilot() {
  const {
    enabled, toggle, setEnabled, setNextActions, setCoachingMessages,
    setLoading, dismissAction, ackCoachingMessage, dismissCoachingMessage,
  } = useAutoPilotStore();
  const { sendNotification } = useNotifications();

  const syncToDb = useCallback(async () => {
    try {
      const { autopilotEnabled } = await api.toggleAutoPilot();
      setEnabled(autopilotEnabled);
      return autopilotEnabled;
    } catch (e) {
      console.error('[useAutoPilot] toggle sync failed:', e);
    }
  }, [setEnabled]);

  const handleToggle = useCallback(async () => {
    toggle(); // optimistic local update
    await syncToDb();
  }, [toggle, syncToDb]);

  const refresh = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    try {
      const [actionsRes, coachingRes] = await Promise.all([
        api.getNextActions(),
        api.getCoachingMessages(),
      ]);
      setNextActions(actionsRes.actions || []);
      const messages = coachingRes.messages || [];
      setCoachingMessages(messages);

      // Surface first unread coaching message as a browser notification
      const unread = messages.find((m) => !m.read);
      if (unread) sendNotification('V AutoPilot', { body: unread.message, tag: unread.id });
    } catch (e) {
      console.error('[useAutoPilot] refresh failed:', e);
    } finally {
      setLoading(false);
    }
  }, [enabled, setNextActions, setCoachingMessages, setLoading, sendNotification]);

  useEffect(() => {
    refresh();
  }, [enabled]);

  const handleDismissAction = useCallback(async (actionType) => {
    dismissAction(actionType);
    try {
      const res = await api.dismissAction(actionType);
      setNextActions(res.actions || []);
    } catch (e) { /* optimistic dismiss already applied */ }
  }, [dismissAction, setNextActions]);

  const handleAckMessage = useCallback(async (id) => {
    ackCoachingMessage(id);
    await api.ackCoachingMessage(id).catch(() => {});
  }, [ackCoachingMessage]);

  const handleDismissMessage = useCallback(async (id) => {
    dismissCoachingMessage(id);
    await api.dismissCoachingMessage(id).catch(() => {});
  }, [dismissCoachingMessage]);

  return {
    enabled,
    handleToggle,
    refresh,
    handleDismissAction,
    handleAckMessage,
    handleDismissMessage,
  };
}
