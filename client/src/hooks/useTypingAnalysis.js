/** @fileoverview ML typing analysis hook - triggers analysis and retrieves reports */
import { useState } from 'react';
import { runAnalysis as apiRunAnalysis, getReport as apiGetReport, getGeminiOverview as apiGetOverview } from '../api/typing';

const useTypingAnalysis = () => {
  const [report, setReport] = useState(null);
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRunAnalysis();
      setReport(data.report || data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGetReport();
      if (!data) return; // no analysis yet — server returns null
      setReport(data.report || data);
      if (data.geminiAdvice) setAdvice(data.geminiAdvice);
      return data;
    } catch (err) {
      if (!err.message.includes('No analysis found')) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getOverview = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGetOverview();
      setAdvice(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { report, advice, runAnalysis, fetchReport, getOverview, loading, error };
};

export default useTypingAnalysis;
