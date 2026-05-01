const API_URL = 'http://localhost:5000/api';

export const login = async (provider, accountId, name, avatar) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider, accountId, name, avatar })
  });
  return res.json();
};

export const registerEmail = async (name, email, password) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  return res.json();
};

export const loginEmail = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
};

export const getProfile = async (token) => {
  const res = await fetch(`${API_URL}/user/profile`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
};

export const getCases = async () => {
  const res = await fetch(`${API_URL}/cases`);
  return res.json();
};

export const openCase = async (caseId, token) => {
  const res = await fetch(`${API_URL}/cases/open/${caseId}`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' 
    }
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to open case');
  }
  return res.json();
};

export const sellItem = async (inventoryId, token) => {
  const res = await fetch(`${API_URL}/inventory/sell/${inventoryId}`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}` 
    }
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to sell item');
  }
  return res.json();
};
