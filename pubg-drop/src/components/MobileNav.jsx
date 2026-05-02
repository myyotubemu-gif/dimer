import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, CreditCard, Gamepad2, MessageSquare, Menu } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './MobileNav.css';

function MobileNav({ onMenuClick }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="mobile-nav-bottom glass">
      <Link to="/" className={`mobile-nav-item ${isActive('/') ? 'active' : ''}`}>
        <Package size={22} />
        <span>Keyslari</span>
      </Link>
      
      <Link to="/topup" className={`mobile-nav-item ${isActive('/topup') ? 'active' : ''}`}>
        <CreditCard size={22} />
        <span>To'ldirish</span>
      </Link>

      <Link to="/news-promo" className={`mobile-nav-item ${isActive('/news-promo') ? 'active' : ''}`}>
        <Gamepad2 size={22} />
        <span>O'yinlar.</span>
      </Link>

      <a href="https://t.me/Dimer_pubg" target="_blank" rel="noreferrer" className="mobile-nav-item">
        <MessageSquare size={22} />
        <span>Chat</span>
      </a>

      <Link to="/profile" className={`mobile-nav-item ${isActive('/profile') ? 'active' : ''}`}>
        <Menu size={22} />
        <span>Menyu</span>
      </Link>
    </nav>
  );
}

export default MobileNav;
