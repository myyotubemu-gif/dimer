import React, { createContext, useState, useCallback } from 'react';

export const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToast({ id, message, type });

    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToast(prev => (prev?.id === id ? null : prev));
    }, 4000);
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <Toast key={toast.id} toast={toast} onHide={hideToast} />}
    </ToastContext.Provider>
  );
};

const Toast = ({ toast, onHide }) => {
  return (
    <div className={`toast-container animate-slide-in glass glass-glow toast-${toast.type}`}>
      <div className="toast-icon">
        {toast.type === 'success' && '✅'}
        {toast.type === 'error' && '❌'}
        {toast.type === 'info' && 'ℹ️'}
      </div>
      <div className="toast-message">{toast.message}</div>
      <button className="toast-close" onClick={onHide}>&times;</button>
    </div>
  );
};
