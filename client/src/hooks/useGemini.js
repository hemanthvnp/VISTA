/** @fileoverview Gemini API hook - wraps backend calls for AI tutor chat */
import { useState } from 'react';
import { sendTutorMessage as apiSendMessage } from '../api/learning';

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

  return { sendTutorMessage, loading, error };
};

export default useGemini;
