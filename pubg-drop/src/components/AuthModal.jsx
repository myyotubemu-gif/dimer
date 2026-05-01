import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, loginWithEmail, registerWithEmail } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let result;

    if (isLogin) {
      result = await loginWithEmail(email, password);
    } else {
      result = await registerWithEmail(name, email, password);
    }

    if (result.success) {
      showToast(isLogin ? 'Xush kelibsiz!' : 'Muvaffaqiyatli ro\'yxatdan o\'tdingiz!', 'success');
      onClose();
    } else {
      showToast(result.error || 'Xatolik yuz berdi', 'error');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const result = await login();
    if (result.success) {
      showToast('Google orqali kirdingiz!', 'success');
      onClose();
    } else {
      showToast(result.error, 'error');
    }
    setLoading(false);
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content glass glass-glow animate-fade-in" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <div className="auth-tabs">
          <button className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)}>Kirish</button>
          <button className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)}>Ro'yxatdan o'tish</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label>Ismingiz</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ismingizni kiriting" required />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@mail.com" required />
          </div>
          <div className="form-group">
            <label>Parol</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="******" required />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Yuklanmoqda...' : (isLogin ? 'Kirish' : 'Ro\'yxatdan o\'tish')}
          </button>
        </form>

        <div className="auth-divider">
          <span>Yoki</span>
        </div>

        <div className="social-auth">
          <button className="btn btn-secondary social-btn google" onClick={handleGoogleLogin}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" alt="Google" />
            Google bilan kirish
          </button>
          <button className="btn btn-secondary social-btn telegram" onClick={() => showToast('Tez kunda...', 'info')}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" alt="Telegram" />
            Telegram bilan kirish
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
