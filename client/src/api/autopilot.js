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

export const getUserModel = () =>
  fetch('/api/autopilot/user-model', { headers: getHeaders() }).then(handleResponse);

export const toggleAutoPilot = () =>
  fetch('/api/autopilot/toggle', { method: 'PATCH', headers: getHeaders() }).then(handleResponse);

export const getNextActions = () =>
  fetch('/api/autopilot/next-action', { headers: getHeaders() }).then(handleResponse);

export const dismissAction = (actionType) =>
  fetch(`/api/autopilot/next-action/${actionType}/dismiss`, { method: 'POST', headers: getHeaders() }).then(handleResponse);

export const getCoachingMessages = () =>
  fetch('/api/autopilot/coaching/messages', { headers: getHeaders() }).then(handleResponse);

export const ackCoachingMessage = (id) =>
  fetch(`/api/autopilot/coaching/messages/${id}/ack`, { method: 'POST', headers: getHeaders() }).then(handleResponse);

export const dismissCoachingMessage = (id) =>
  fetch(`/api/autopilot/coaching/messages/${id}/dismiss`, { method: 'POST', headers: getHeaders() }).then(handleResponse);

export const getAutoPilotFlashcards = (topicId) =>
  fetch('/api/autopilot/content/flashcards', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ topicId }),
  }).then(handleResponse);

export const getLessonSummary = (topicId) =>
  fetch(`/api/autopilot/content/lesson-summary/${topicId}`, { headers: getHeaders() }).then(handleResponse);
