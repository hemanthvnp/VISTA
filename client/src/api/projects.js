/** @fileoverview API service for mini-project GitHub submissions and AI review */

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

export const submitProject = async ({ submissionId, title, repoUrl, githubUsername, demoUrl, notes }) => {
  const res = await fetch('/api/projects/submit', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ submissionId, title, repoUrl, githubUsername, demoUrl, notes }),
  });
  return handleResponse(res);
};

export const getSubmissions = async () => {
  const res = await fetch('/api/projects/submissions', { headers: getHeaders() });
  return handleResponse(res);
};

export const deleteSubmission = async (id) => {
  const res = await fetch(`/api/projects/${id}`, { method: 'DELETE', headers: getHeaders() });
  return handleResponse(res);
};
