import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { Navigate } from 'react-router-dom';
import { Plus, Trash2, Gift, Newspaper } from 'lucide-react';
import './AdminPanel.css';

function AdminPanel() {
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const [news, setNews] = useState([]);
  const [promos, setPromos] = useState([]);
  
  const [newsForm, setNewsForm] = useState({ title: '', content: '' });
  const [promoForm, setPromoForm] = useState({ code: '', rewardUC: 0, maxUses: 1 });

  // Safety check: if not admin, redirect
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  const handleAddNews = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/news`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newsForm)
      });
      if (res.ok) {
        showToast('Yangilik qo\'shildi', 'success');
        setNewsForm({ title: '', content: '' });
      }
    } catch (err) {
      showToast('Xatolik', 'error');
    }
  };

  const handleAddPromo = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/promocode`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(promoForm)
      });
      if (res.ok) {
        showToast('Promokod yaratildi', 'success');
        setPromoForm({ code: '', rewardUC: 0, maxUses: 1 });
      }
    } catch (err) {
      showToast('Xatolik', 'error');
    }
  };

  return (
    <div className="admin-panel animate-fade-in">
      <header className="admin-header">
        <h1>Admin Panel</h1>
        <p>Tizimni boshqarish bo'limi</p>
      </header>

      <div className="admin-grid">
        {/* News Section */}
        <section className="admin-section glass">
          <div className="section-header">
            <Newspaper className="text-primary" />
            <h2>Yangilik Qo'shish</h2>
          </div>
          <form onSubmit={handleAddNews} className="admin-form">
            <input 
              type="text" 
              placeholder="Sarlavha" 
              value={newsForm.title}
              onChange={e => setNewsForm({...newsForm, title: e.target.value})}
              required 
            />
            <textarea 
              placeholder="Yangilik matni" 
              value={newsForm.content}
              onChange={e => setNewsForm({...newsForm, content: e.target.value})}
              required
            ></textarea>
            <button className="btn btn-primary"><Plus size={18} /> Qo'shish</button>
          </form>
        </section>

        {/* Promo Section */}
        <section className="admin-section glass">
          <div className="section-header">
            <Gift className="text-primary" />
            <h2>Promokod Yaratish</h2>
          </div>
          <form onSubmit={handleAddPromo} className="admin-form">
            <input 
              type="text" 
              placeholder="Kod (masalan: NEWYEAR)" 
              value={promoForm.code}
              onChange={e => setPromoForm({...promoForm, code: e.target.value})}
              required 
            />
            <input 
              type="number" 
              placeholder="Mukofot UC" 
              value={promoForm.rewardUC}
              onChange={e => setPromoForm({...promoForm, rewardUC: e.target.value})}
              required 
            />
            <input 
              type="number" 
              placeholder="Ishlatish soni" 
              value={promoForm.maxUses}
              onChange={e => setPromoForm({...promoForm, maxUses: e.target.value})}
              required 
            />
            <button className="btn btn-primary"><Plus size={18} /> Yaratish</button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default AdminPanel;
