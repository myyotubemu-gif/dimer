import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, Newspaper, User, Menu } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './MobileNav.css';

function MobileNav({ onMenuClick }) {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="mobile-nav-bottom glass">
      <Link to="/" className={`mobile-nav-item ${isActive('/') ? 'active' : ''}`}>
        <Package size={24} />
        <span>Keyslar</span>
      </Link>
      
      <Link to="/news-promo" className={`mobile-nav-item ${isActive('/news-promo') ? 'active' : ''}`}>
        <Newspaper size={24} />
        <span>Yangiliklar</span>
      </Link>

      <Link to="/profile" className={`mobile-nav-item ${isActive('/profile') ? 'active' : ''}`}>
        <User size={24} />
        <span>Profil</span>
      </Link>

      <button className="mobile-nav-item" onClick={onMenuClick}>
        <Menu size={24} />
        <span>Menyu</span>
      </button>
    </nav>
  );
}

export default MobileNav;
