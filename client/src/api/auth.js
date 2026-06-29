/** @fileoverview API service for authentication endpoints */

const API_BASE = '/api/auth';

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

export const register = async (name, email, password) => {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse(res);
};

export const login = async (email, password) => {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
};

export const getMe = async () => {
  const res = await fetch(`${API_BASE}/me`, { headers: getHeaders() });
  return handleResponse(res);
};

export const updateProfile = async (data) => {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const changePassword = async (oldPassword, newPassword) => {
  const res = await fetch(`${API_BASE}/password`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ oldPassword, newPassword }),
  });
  return handleResponse(res);
};

export const deleteAccount = async () => {
  const res = await fetch(`${API_BASE}/account`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse(res);
};
