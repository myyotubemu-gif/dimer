import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { Navigate } from 'react-router-dom';
import { Plus, Trash2, Gift, Newspaper, Send, Users, TrendingUp, Wallet } from 'lucide-react';
import { getAdminPromos, createAdminPromo, createAdminNews, updateSettings, getSettings } from '../api';
import './AdminPanel.css';

function AdminPanel() {
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  
  const [newsForm, setNewsForm] = useState({ title: '', content: '' });
  const [promoForm, setPromoForm] = useState({ code: '', rewardUC: 0, maxUses: 1 });
  const [telegramLink, setTelegramLink] = useState('');
  const [settingsForm, setSettingsForm] = useState({ 
    telegramLink: '', 
    paymeMerchantId: '', 
    clickServiceId: '', 
    clickMerchantId: '' 
  });
  const [promoList, setPromoList] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalTransactions: 0, totalRevenue: 0, totalUCSpent: 0 });

  // Safety check: if not admin, redirect
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/settings`)
      .then(res => res.json())
      .then(data => {
        setTelegramLink(data.telegramLink);
        setSettingsForm({
          telegramLink: data.telegramLink,
          paymeMerchantId: data.paymeMerchantId || '',
          clickServiceId: data.clickServiceId || '',
          clickMerchantId: data.clickMerchantId || ''
        });
      });
    
    loadAdminData();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/stats`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setStats(data);
    } catch (err) {}
  };

  const loadAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      const settingsData = await getSettings();
      setTelegramLink(settingsData.telegramLink);
      setSettingsForm({
        telegramLink: settingsData.telegramLink,
        paymeMerchantId: settingsData.paymeMerchantId || '',
        clickServiceId: settingsData.clickServiceId || '',
        clickMerchantId: settingsData.clickMerchantId || ''
      });
      
      const promosData = await getAdminPromos(token);
      setPromoList(promosData);
    } catch (err) {
      console.error('Admin data load error:', err);
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await updateSettings({ telegramLink }, token);
      showToast('Sozlamalar saqlandi', 'success');
    } catch (err) {
      showToast('Xatolik', 'error');
    }
  };

  const handleAddNews = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await createAdminNews(newsForm, token);
      showToast('Yangilik qo\'shildi', 'success');
      setNewsForm({ title: '', content: '' });
    } catch (err) {
      showToast('Xatolik', 'error');
    }
  };

  const handleAddPromo = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const data = await createAdminPromo(promoForm, token);
      if (data.error) {
        showToast(data.error, 'error');
      } else {
        showToast('Promokod yaratildi', 'success');
        setPromoForm({ code: '', rewardUC: 0, maxUses: 1 });
        loadAdminData();
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

      <div className="admin-stats-grid">
        <div className="stat-card glass">
          <div className="stat-icon users"><Users size={24} /></div>
          <div className="stat-info">
            <span>Foydalanuvchilar</span>
            <strong>{stats.totalUsers}</strong>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon money"><TrendingUp size={24} /></div>
          <div className="stat-info">
            <span>Jami Tushum</span>
            <strong>{stats.totalRevenue.toLocaleString()} UZS</strong>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon transactions"><Wallet size={24} /></div>
          <div className="stat-info">
            <span>To'lovlar Soni</span>
            <strong>{stats.totalTransactions}</strong>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon uc"><Gift size={24} /></div>
          <div className="stat-info">
            <span>Berilgan UC</span>
            <strong>{stats.totalUCSpent.toLocaleString()} UC</strong>
          </div>
        </div>
      </div>

      <div className="admin-grid">
        {/* Settings Section */}
        <section className="admin-section glass" style={{ gridColumn: '1 / -1' }}>
          <div className="section-header">
            <Send size={20} />
            <h2>Tizim Sozlamalari</h2>
          </div>
          <form onSubmit={handleSaveSettings} className="admin-form">
            <div className="form-group">
              <label>Telegram Kanal Havolasi</label>
              <input 
                type="url" 
                value={settingsForm.telegramLink} 
                onChange={(e) => setSettingsForm({...settingsForm, telegramLink: e.target.value})} 
                placeholder="https://t.me/yourchannel"
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Payme Merchant ID</label>
                <input 
                  type="text" 
                  value={settingsForm.paymeMerchantId} 
                  onChange={(e) => setSettingsForm({...settingsForm, paymeMerchantId: e.target.value})} 
                  placeholder="66184a5..."
                />
              </div>
              <div className="form-group">
                <label>Click Service ID</label>
                <input 
                  type="text" 
                  value={settingsForm.clickServiceId} 
                  onChange={(e) => setSettingsForm({...settingsForm, clickServiceId: e.target.value})} 
                  placeholder="32840"
                />
              </div>
              <div className="form-group">
                <label>Click Merchant ID</label>
                <input 
                  type="text" 
                  value={settingsForm.clickMerchantId} 
                  onChange={(e) => setSettingsForm({...settingsForm, clickMerchantId: e.target.value})} 
                  placeholder="24560"
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Saqlash</button>
          </form>
        </section>

        {/* News Section */}
        <section className="admin-section glass">
          <div className="section-header">
            <Newspaper className="text-primary" />
            <h2>Yangilik Qo'shish</h2>
          </div>
          <form onSubmit={handleAddNews} className="admin-form">
            <div className="input-group">
              <label>Sarlavha</label>
              <input 
                type="text" 
                placeholder="Yangilik sarlavhasi" 
                value={newsForm.title}
                onChange={e => setNewsForm({...newsForm, title: e.target.value})}
                required 
              />
            </div>
            <div className="input-group">
              <label>Matn</label>
              <textarea 
                placeholder="Yangilik matni" 
                value={newsForm.content}
                onChange={e => setNewsForm({...newsForm, content: e.target.value})}
                required
              ></textarea>
            </div>
            <button className="btn btn-primary" style={{ marginTop: '1rem' }}><Plus size={18} /> Qo'shish</button>
          </form>
        </section>

        {/* Promo Section */}
        <section className="admin-section glass">
          <div className="section-header">
            <Gift className="text-primary" />
            <h2>Promokod Yaratish</h2>
          </div>
          <form onSubmit={handleAddPromo} className="admin-form">
            <div className="input-group">
              <label>Promokod nomi</label>
              <input 
                type="text" 
                placeholder="Masalan: DEMER2024" 
                value={promoForm.code}
                onChange={e => setPromoForm({...promoForm, code: e.target.value})}
                required 
              />
            </div>
            <div className="input-group">
              <label>UC miqdori (Yutuq)</label>
              <input 
                type="number" 
                placeholder="Masalan: 500" 
                value={promoForm.rewardUC}
                onChange={e => setPromoForm({...promoForm, rewardUC: e.target.value})}
                required 
              />
            </div>
            <div className="input-group">
              <label>Limit (Necha kishi ishlata oladi)</label>
              <input 
                type="number" 
                placeholder="Masalan: 50" 
                value={promoForm.maxUses}
                onChange={e => setPromoForm({...promoForm, maxUses: e.target.value})}
                required 
              />
            </div>
            <button className="btn btn-primary" style={{ marginTop: '1rem' }}><Plus size={18} /> YARATISH</button>
          </form>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Mavjud Promokodlar</h3>
            <div className="promo-list-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Kod</th>
                    <th>UC</th>
                    <th>Limit</th>
                    <th>Ishlatildi</th>
                  </tr>
                </thead>
                <tbody>
                  {promoList.map(p => (
                    <tr key={p.id}>
                      <td>{p.code}</td>
                      <td>{p.rewardUC}</td>
                      <td>{p.maxUses}</td>
                      <td>{p.usedCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminPanel;
