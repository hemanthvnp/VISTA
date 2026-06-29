/** @fileoverview Gemini API hook - wraps backend calls for tutor and typing advice */
import { useState } from 'react';
import { sendTutorMessage as apiSendMessage } from '../api/learning';
import { getGeminiOverview as apiGetOverview } from '../api/typing';

const useGemini = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendTutorMessage = async (message) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiSendMessage(message);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTypingOverview = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGetOverview();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { sendTutorMessage, getTypingOverview, loading, error };
};

export default useGemini;
