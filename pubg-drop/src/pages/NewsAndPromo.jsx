import React, { useState, useEffect, useContext } from 'react';
import { Gift, Newspaper, Send, ExternalLink } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import './NewsAndPromo.css';

function NewsAndPromo() {
  const [news, setNews] = useState([]);
  const [settings, setSettings] = useState({ telegramLink: '' });
  const [promoCode, setPromoCode] = useState('');
  const { user, setUser } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    // Fetch news
    fetch(`${import.meta.env.VITE_API_URL}/news`)
      .then(res => res.json())
      .then(data => setNews(data));

    // Fetch settings (telegram link)
    fetch(`${import.meta.env.VITE_API_URL}/settings`)
      .then(res => res.json())
      .then(data => setSettings(data));
  }, []);

  const handleActivatePromo = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Avval tizimga kiring', 'error');
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/promocode/activate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ code: promoCode })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Muvaffaqiyatli! ${data.reward} UC qo'shildi.`, 'success');
        setUser({ ...user, balanceUC: user.balanceUC + data.reward });
        setPromoCode('');
      } else {
        showToast(data.error, 'error');
      }
    } catch (err) {
      showToast('Xatolik yuz berdi', 'error');
    }
  };

  return (
    <div className="news-promo-page animate-fade-in">
      <div className="page-header">
        <h1>Yangiliklar & Promokodlar</h1>
        <p>Eng so'nggi xabarlar va maxsus bonuslar</p>
      </div>

      <div className="news-promo-grid">
        {/* Left side: News and Telegram */}
        <div className="news-column">
          <section className="telegram-card glass-glow">
            <div className="card-icon">
              <Send size={32} />
            </div>
            <div className="card-content">
              <h3>Bizning Telegram Kanal</h3>
              <p>Promokodlar va yutuqli o'yinlar haqida birinchi bo'lib biling!</p>
              <a href={settings.telegramLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                A'zo bo'lish <ExternalLink size={16} />
              </a>
            </div>
          </section>

          <section className="news-list-section">
            <div className="section-title">
              <Newspaper size={24} />
              <h2>So'nggi Yangiliklar</h2>
            </div>
            <div className="news-items">
              {news.length === 0 ? (
                <div className="glass empty-state">Hozircha yangiliklar yo'q.</div>
              ) : (
                news.map(item => (
                  <div key={item.id} className="news-card glass">
                    <div className="news-card-header">
                      <h3>{item.title}</h3>
                      <span className="date">{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p>{item.content}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Right side: Promocode activation */}
        <div className="promo-column">
          <section className="promo-activation-card glass">
            <div className="card-icon">
              <Gift size={40} className="text-primary" />
            </div>
            <h2>Promokod Faollashtirish</h2>
            <p>Sizda promokod bormi? Uni kiriting va hisobingizni UC bilan to'ldiring!</p>
            
            <form onSubmit={handleActivatePromo} className="promo-form">
              <input 
                type="text" 
                placeholder="PROMO2024" 
                value={promoCode}
                onChange={e => setPromoCode(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">Faollashtirish</button>
            </form>

            <div className="promo-tips">
              <h4>Qanday qilib promokod olish mumkin?</h4>
              <ul>
                <li>Telegram kanalimizni kuzatib boring</li>
                <li>Bayramlar va maxsus tadbirlarda ishtirok eting</li>
                <li>Yutuqli o'yinlar g'olibi bo'ling</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default NewsAndPromo;
