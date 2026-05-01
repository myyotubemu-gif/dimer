const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;

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
export const activatePromo = async (code, token) => {
  const res = await fetch(`${API_URL}/promocode/activate`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({ code })
  });
  return res.json();
};

export const getNews = async () => {
  const res = await fetch(`${API_URL}/news`);
  return res.json();
};

export const getSettings = async () => {
  const res = await fetch(`${API_URL}/settings`);
  return res.json();
};

// Admin Routes
export const getAdminPromos = async (token) => {
  const res = await fetch(`${API_URL}/admin/promocodes`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
};

export const createAdminPromo = async (promoData, token) => {
  const res = await fetch(`${API_URL}/admin/promocode`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify(promoData)
  });
  return res.json();
};

export const createAdminNews = async (newsData, token) => {
  const res = await fetch(`${API_URL}/admin/news`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify(newsData)
  });
  return res.json();
};

export const updateSettings = async (settingsData, token) => {
  const res = await fetch(`${API_URL}/admin/settings`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify(settingsData)
  });
  return res.json();
};

export { API_URL };
