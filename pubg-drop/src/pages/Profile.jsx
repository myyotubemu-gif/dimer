import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { sellItem } from '../api';
import { History, Package, CreditCard, LogOut } from 'lucide-react';
import './Profile.css';

function Profile() {
  const { user, token, fetchProfile, logout } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const [sellingId, setSellingId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('inventory');

  useEffect(() => {
    if (token) {
      fetchTransactions();
    }
  }, [token]);

  const fetchTransactions = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/user/transactions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setTransactions(data);
    } catch (err) {}
  };

  if (!user) {
    return <div className="profile-page animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}><h2>Iltimos tizimga kiring!</h2></div>;
  }

  const inventory = user.inventory || [];

  const handleSell = async (invId) => {
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
          <div className="profile-header-actions">
            <button className="btn btn-secondary logout-btn" onClick={logout}>
              <LogOut size={16} /> Chiqish
            </button>
          </div>
        </div>
        <div className="profile-stats">
          <div className="stat-box">
            <span>Ochilgan Keyslar</span>
            <strong>{inventory.length}</strong>
          </div>
          <div className="stat-box">
            <span>Balans</span>
            <strong className="text-primary">
              <img src="https://www.freeiconspng.com/uploads/gold-coin-png-10.png" alt="UC" />
              {user.balanceUC}
            </strong>
          </div>
        </div>
      </div>

      <div className="profile-content-tabs">
        <button 
          className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`} 
          onClick={() => setActiveTab('inventory')}
        >
          <Package size={20} /> Inventar
        </button>
        <button 
          className={`tab-btn ${activeTab === 'transactions' ? 'active' : ''}`} 
          onClick={() => setActiveTab('transactions')}
        >
          <History size={20} /> To'lovlar Tarixi
        </button>
      </div>

      {activeTab === 'inventory' ? (
        <div className="inventory-section animate-fade-in">
          <div className="inventory-grid">
            {inventory.map(inv => (
              <div key={inv.id} className={`inventory-item glass tier-${inv.item.type}`}>
                <div className="item-img-container">
                  <img src={inv.item.image} alt={inv.item.name} />
                </div>
                <span>{inv.item.name}</span>
                <button 
                  className="btn btn-primary btn-sell-small" 
                  onClick={() => handleSell(inv.id)}
                  disabled={sellingId === inv.id}
                >
                  {sellingId === inv.id ? '...' : `Sotish (+${inv.item.sellPriceUC})`}
                </button>
              </div>
            ))}
            {inventory.length === 0 && (
              <div className="empty-state glass">
                <Package size={48} opacity={0.2} />
                <p>Inventaringiz bo'sh</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="transactions-section animate-fade-in">
          <div className="transactions-list glass">
            {transactions.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Sana</th>
                    <th>Tizim</th>
                    <th>Summa</th>
                    <th>UC</th>
                    <th>Holat</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(tx => (
                    <tr key={tx.id}>
                      <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                      <td style={{ textTransform: 'uppercase' }}>{tx.provider}</td>
                      <td>{tx.amountUZS.toLocaleString()} UZS</td>
                      <td>{tx.amountUC} UC</td>
                      <td>
                        <span className={`status-badge ${tx.status.toLowerCase()}`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <CreditCard size={48} opacity={0.2} />
                <p>To'lovlar topilmadi</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
