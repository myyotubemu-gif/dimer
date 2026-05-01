import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { sellItem } from '../api';
import './Profile.css';

function Profile() {
  const { user, token, fetchProfile, logout } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const [sellingId, setSellingId] = useState(null);

  if (!user) {
    return <div className="profile-page animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}><h2>Iltimos tizimga kiring!</h2></div>;
  }

  const inventory = user.inventory || [];

  const handleSell = async (invId, price) => {
    if(sellingId) return;
    setSellingId(invId);
    try {
      const res = await sellItem(invId, token);
      showToast(`Sotildi! +${res.soldFor} UC`, "success");
      fetchProfile(token);
    } catch(err) {
      showToast(err.message, "error");
    } finally {
      setSellingId(null);
    }
  };

  return (
    <div className="profile-page animate-fade-in">
      <div className="profile-header glass glass-glow">
        <img src={user.avatar} alt="Avatar" className="profile-avatar" />
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p className="user-id">ID: {user.id.substring(0,8)}</p>
          <button 
            className="btn btn-secondary" 
            onClick={logout}
            style={{ marginTop: '10px', borderColor: 'rgba(239, 68, 68, 0.5)', color: '#ef4444' }}
          >
            Tizimdan Chiqish
          </button>
        </div>
        <div className="profile-stats">
          <div className="stat-box">
            <span>Ochilgan Keyslar</span>
            <strong>{inventory.length}</strong>
          </div>
          <div className="stat-box">
            <span>Balans</span>
            <strong className="text-primary" style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center' }}>
              <img src="https://pubgmobile.uz/images/uc-coin.png" alt="UC" style={{ width: '20px', height: '20px', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline'; }} />
              <span style={{ display: 'none' }}>UC</span>
              {user.balanceUC}
            </strong>
          </div>
        </div>
      </div>

      <div className="inventory-section">
        <h3>Mening Inventarim</h3>
        <div className="inventory-grid">
          {inventory.map(inv => (
            <div key={inv.id} className={`inventory-item glass tier-${inv.item.type}`}>
              <img src={inv.item.image} alt={inv.item.name} />
              <span>{inv.item.name}</span>
              <button 
                className="btn btn-secondary btn-sell-small" 
                onClick={() => handleSell(inv.id, inv.item.sellPriceUC)}
                disabled={sellingId === inv.id}
              >
                {sellingId === inv.id ? '...' : `Sotish (+${inv.item.sellPriceUC})`}
              </button>
            </div>
          ))}
          {inventory.length === 0 && <p className="empty-inventory">Inventaringiz bo'sh</p>}
        </div>
      </div>
    </div>
  );
}

export default Profile;
