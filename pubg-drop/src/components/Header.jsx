import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import AuthModal from './AuthModal';
import { 
  User as UserIcon, 
  Headphones, 
  Gift, 
  CreditCard, 
  ArrowUpRight, 
  LogOut, 
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import './Header.css';

function Header() {
  const { user, logout } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
    showToast('Tizimdan chiqdingiz', 'info');
  };

  return (
    <>
      <header className="header glass">
        <div className="container header-content">
          <Link to="/" className="logo" onClick={() => setIsMobileMenuOpen(false)}>
            BULL<span>DROP</span>
          </Link>

          <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Keyslar</Link>
            <button className="nav-link-btn" onClick={() => { setIsNewsModalOpen(true); setIsMobileMenuOpen(false); }}>Yangiliklar</button>
            <button className="nav-link-btn" onClick={() => { setIsPromoModalOpen(true); setIsMobileMenuOpen(false); }}>Promokodlar</button>
            {!user && (
              <button className="btn btn-primary mobile-only" onClick={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }}>
                Tizimga Kirish
              </button>
            )}
          </nav>
          
          <div className="user-actions">
            {user ? (
              <>
                <div className="balance-badge">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <img src="https://pubgmobile.uz/images/uc-coin.png" alt="UC" style={{ width: '20px', height: '20px', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline'; }} />
                    <span style={{ display: 'none', color: '#ffb300', fontWeight: 'bold' }}>UC</span>
                    {user.balanceUC.toLocaleString()}
                  </span>
                  <Link to="/topup" className="btn-add">+</Link>
                </div>
                <div className="profile-container" ref={dropdownRef}>
                  <button className="profile-btn" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <img src={user.avatar} alt="Profile" />
                    <ChevronDown className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`} size={16} />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="user-dropdown glass animate-fade-in">
                      <div className="dropdown-user-info">
                        <strong>{user.name}</strong>
                        <span>ID: {user.id.substring(0, 8)}</span>
                      </div>
                      <div className="dropdown-divider"></div>
                      <Link to="/profile" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                        <UserIcon className="icon" size={18} /> Shaxsiy kabinet
                      </Link>
                      <button className="dropdown-item" onClick={() => { setIsDropdownOpen(false); setIsNewsModalOpen(true); }}>
                        <Headphones className="icon" size={18} /> Yangiliklar
                      </button>
                      <button className="dropdown-item" onClick={() => { setIsDropdownOpen(false); setIsPromoModalOpen(true); }}>
                        <Gift className="icon" size={18} /> Promokod
                      </button>
                      {user.role === 'admin' && (
                        <Link to="/admin-secret" className="dropdown-item text-primary" onClick={() => setIsDropdownOpen(false)}>
                          <ArrowUpRight className="icon" size={18} /> Admin Panel
                        </Link>
                      )}
                      <div className="dropdown-divider"></div>
                      <button className="dropdown-item text-error" onClick={handleLogout}>
                        <LogOut className="icon" size={18} /> Chiqish
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button className="btn btn-primary" onClick={() => setIsAuthModalOpen(true)}>
                Tizimga Kirish
              </button>
            )}
          </div>
        </div>
      </header>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <PromoModal isOpen={isPromoModalOpen} onClose={() => setIsPromoModalOpen(false)} />
      <NewsModal isOpen={isNewsModalOpen} onClose={() => setIsNewsModalOpen(false)} />
    </>
  );
}

// Quick Inline Modals for now (will move to separate files if they grow)
function PromoModal({ isOpen, onClose }) {
  const [code, setCode] = useState('');
  const { showToast } = useContext(ToastContext);
  const { user, setUser } = useContext(AuthContext);

  if (!isOpen) return null;

  const handleActivate = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/promocode/activate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Muvaffaqiyatli! ${data.reward} UC qo'shildi.`, 'success');
        setUser({ ...user, balanceUC: user.balanceUC + data.reward });
        onClose();
      } else {
        showToast(data.error, 'error');
      }
    } catch (err) {
      showToast('Xatolik yuz berdi', 'error');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-scale-in" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={24} /></button>
        <div className="modal-header">
          <Gift size={32} className="text-primary" />
          <h2>Promokod Faollashtirish</h2>
        </div>
        <div className="modal-body">
          <div className="input-group">
            <label>Kod kiriting</label>
            <input 
              type="text" 
              placeholder="Masalan: START2024" 
              value={code}
              onChange={e => setCode(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={handleActivate}>
            Faollashtirish
          </button>
        </div>
      </div>
    </div>
  );
}

function NewsModal({ isOpen, onClose }) {
  const [news, setNews] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/news`)
        .then(res => res.json())
        .then(data => setNews(data));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-scale-in news-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={24} /></button>
        <div className="modal-header">
          <ArrowUpRight size={32} className="text-primary" />
          <h2>Yangiliklar</h2>
        </div>
        <div className="modal-body news-list">
          {news.length === 0 ? (
            <p className="text-muted">Hozircha yangiliklar yo'q.</p>
          ) : (
            news.map(item => (
              <div key={item.id} className="news-item glass">
                <h3>{item.title}</h3>
                <p>{item.content}</p>
                <span className="news-date">{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
