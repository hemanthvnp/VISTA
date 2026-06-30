/** @fileoverview API service for learning features: schedule, notes, snippets, tutor */

const getHeaders = () => {
  const token = localStorage.getItem('vanta_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.message || 'Request failed');
    err.payload = data;
    throw err;
  }
  return data;
};

// Schedule
export const getSchedule = async () => {
  const res = await fetch('/api/learning/schedule', { headers: getHeaders() });
  return handleResponse(res);
};

export const createWeek = async (data) => {
  const res = await fetch('/api/learning/schedule', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const updateWeek = async (id, data) => {
  const res = await fetch(`/api/learning/schedule/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const deleteWeek = async (id) => {
  const res = await fetch(`/api/learning/schedule/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse(res);
};

// Notes
export const getNotes = async (techId) => {
  const res = await fetch(`/api/learning/notes/${techId}`, { headers: getHeaders() });
  return handleResponse(res);
};

export const updateNotes = async (techId, content) => {
  const res = await fetch(`/api/learning/notes/${techId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ content }),
  });
  return handleResponse(res);
};

export const checkNoteQuality = async (techId) => {
  const res = await fetch(`/api/learning/notes/${techId}/quality-check`, {
    method: 'POST',
    headers: getHeaders(),
  });
  return handleResponse(res);
};

export const publishNoteToMedium = async (techId) => {
  const res = await fetch(`/api/learning/notes/${techId}/publish`, {
    method: 'POST',
    headers: getHeaders(),
  });
  return handleResponse(res);
};

// Medium connection
export const connectMedium = async (token) => {
  const res = await fetch('/api/medium/connect', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ token }),
  });
  return handleResponse(res);
};

export const getMediumStatus = async () => {
  const res = await fetch('/api/medium/status', { headers: getHeaders() });
  return handleResponse(res);
};

export const disconnectMedium = async () => {
  const res = await fetch('/api/medium/disconnect', {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse(res);
};

// Snippets
export const getSnippets = async () => {
  const res = await fetch('/api/snippets', { headers: getHeaders() });
  return handleResponse(res);
};

export const saveSnippet = async (data) => {
  const res = await fetch('/api/snippets', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const deleteSnippet = async (id) => {
  const res = await fetch(`/api/snippets/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse(res);
};

// Tutor
export const getTutorHistory = async () => {
  const res = await fetch('/api/tutor/history', { headers: getHeaders() });
  return handleResponse(res);
};

export const sendTutorMessage = async (message) => {
  const res = await fetch('/api/tutor/chat', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ message }),
  });
  return handleResponse(res);
};
