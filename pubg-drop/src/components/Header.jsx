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
  X,
  Newspaper
} from 'lucide-react';
import './Header.css';

function Header() {
  const { user, logout } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
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
            <Link to="/news-promo" onClick={() => setIsMobileMenuOpen(false)}>Yangiliklar & Promokodlar</Link>
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
                    <img src="https://www.freeiconspng.com/uploads/gold-coin-png-10.png" alt="UC" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                    {user.balanceUC.toLocaleString()}
                  </span>
                </div>
                <div className="profile-container" ref={dropdownRef}>
                  <button className="profile-btn" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <img src={user.avatar} alt="Profile" />
                    <ChevronDown className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`} size={16} />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="user-dropdown animate-fade-in">
                      <div className="dropdown-user-info">
                        <strong>{user.name}</strong>
                        <span>ID: {user.id.substring(0, 8)}</span>
                      </div>
                      <div className="dropdown-divider"></div>
                      <Link to="/profile" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                        <UserIcon className="icon" size={18} /> Shaxsiy kabinet
                      </Link>
                      <Link to="/news-promo" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                        <Newspaper className="icon" size={18} /> Yangiliklar & Promokodlar
                      </Link>
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
    </>
  );
}

export default Header;
