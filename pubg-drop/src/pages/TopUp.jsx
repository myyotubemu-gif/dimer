import React, { useState } from 'react';
import './TopUp.css';

function TopUp() {
  const ucPackages = [
    { uc: 60, price: 15000 },
    { uc: 325, price: 65000 },
    { uc: 660, price: 130000 },
    { uc: 1800, price: 330000 },
    { uc: 3850, price: 650000 },
    { uc: 8100, price: 1300000 }
  ];

  const [selectedPackage, setSelectedPackage] = useState(ucPackages[0]);

  return (
    <div className="topup-page animate-fade-in">
      <h2>Hisobni To'ldirish</h2>
      <div className="topup-container glass">
        <div className="amount-selection">
          <h3>UC Miqdorini tanlang</h3>
          <div className="amount-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px' }}>
            {ucPackages.map((pkg, idx) => (
              <button 
                key={idx} 
                className={`btn ${selectedPackage.uc === pkg.uc ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedPackage(pkg)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '15px 10px', gap: '8px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <img src="https://pubgmobile.uz/images/uc-coin.png" alt="UC" style={{ width: '24px', height: '24px', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{pkg.uc}</span>
                </div>
                <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>{pkg.price.toLocaleString()} UZS</span>
              </button>
            ))}
          </div>
          <div className="custom-amount" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '10px' }}>
            <span style={{ fontSize: '1.1rem' }}>To'lov summasi:</span>
            <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#ffcc00' }}>{selectedPackage.price.toLocaleString()} UZS</span>
          </div>
        </div>

        <div className="payment-methods">
          <h3>To'lov usulini tanlang</h3>
          <div className="methods-grid">
            <button className="method-btn glass">
              <img src="https://click.uz/click/images/click-logo.png" alt="Click" />
              <span>Click orqali to'lash</span>
            </button>
            <button className="method-btn glass">
              <img src="https://cdn.payme.uz/logo/payme_color.svg" alt="Payme" />
              <span>Payme orqali to'lash</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopUp;
