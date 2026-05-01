import React, { createContext, useState, useEffect } from 'react';
import { getProfile, login as apiLogin, registerEmail as apiRegisterEmail, loginEmail as apiLoginEmail } from '../api';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (currentToken) => {
    try {
      const data = await getProfile(currentToken);
      if (data.id) {
        setUser(data);
      } else {
        logout();
      }
    } catch (err) {
      logout();
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile(token).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async () => {
    try {
      // 1. Google orqali avtorizatsiya qilish
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;

      // 2. Olingan ma'lumotlarni o'zimizning Backend ga yuborish
      const data = await apiLogin(
        'google', 
        googleUser.uid, 
        googleUser.displayName, 
        googleUser.photoURL
      );

      // 3. Backend dan kelgan Token va User ma'lumotlarini saqlash
      if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true };
      }
    } catch (err) {
      console.error('Firebase Login xatosi:', err);
      return { success: false, error: 'Google orqali kirishda xatolik' };
    }
  };

  const registerWithEmail = async (name, email, password) => {
    const data = await apiRegisterEmail(name, email, password);
    if (data.token) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const loginWithEmail = async (email, password) => {
    const data = await apiLoginEmail(email, password);
    if (data.token) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateBalance = (newBalance) => {
    setUser(prev => prev ? { ...prev, balanceUC: newBalance } : null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, loading, login, logout, updateBalance, fetchProfile, registerWithEmail, loginWithEmail }}>
      {children}
    </AuthContext.Provider>
  );
};
