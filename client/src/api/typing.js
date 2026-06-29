/** @fileoverview API service for typing and ML analysis endpoints */

const getHeaders = () => {
  const token = localStorage.getItem('vanta_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export const saveSession = async (sessionData) => {
  const res = await fetch('/api/typing/session', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(sessionData),
  });
  return handleResponse(res);
};

export const getSessions = async (limit = 50) => {
  const res = await fetch(`/api/typing/sessions?limit=${limit}`, {
    headers: getHeaders(),
  });
  return handleResponse(res);
};

export const getStats = async () => {
  const res = await fetch('/api/typing/stats', { headers: getHeaders() });
  return handleResponse(res);
};

export const runAnalysis = async () => {
  const res = await fetch('/api/ml/analyze', {
    method: 'POST',
    headers: getHeaders(),
  });
  return handleResponse(res);
};

export const getReport = async () => {
  const res = await fetch('/api/ml/report', { headers: getHeaders() });
  return handleResponse(res);
};

export const getGeminiOverview = async () => {
  const res = await fetch('/api/ml/gemini-overview', {
    method: 'POST',
    headers: getHeaders(),
  });
  return handleResponse(res);
};
