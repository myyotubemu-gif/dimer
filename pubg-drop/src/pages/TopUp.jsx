import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import './TopUp.css';

function TopUp() {
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  
  const ucPackages = [
    { uc: 60, price: 15000 },
    { uc: 325, price: 65000 },
    { uc: 660, price: 130000 },
    { uc: 1800, price: 330000 },
    { uc: 3850, price: 650000 },
    { uc: 8100, price: 1300000 }
  ];

  const [selectedPackage, setSelectedPackage] = useState(ucPackages[0]);
  const [loading, setLoading] = useState(false);

  const handlePayment = async (provider) => {
    if (!user) {
      showToast('Avval tizimga kiring', 'error');
      return;
    }

    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/payment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amountUZS: selectedPackage.price,
          provider
        })
      });

      const data = await res.json();
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl; // Redirect to Payme/Click
      } else {
        showToast('To\'lov yaratishda xatolik', 'error');
      }
    } catch (err) {
      showToast('Server bilan bog\'lanishda xatolik', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="topup-page animate-fade-in">
      <div className="page-header text-center">
        <h1>Hisobni To'ldirish</h1>
        <p>UC sotib oling va omadingizni sinab ko'ring</p>
      </div>

      <div className="topup-container glass">
        <div className="amount-selection">
          <h3>UC Paketini Tanlang</h3>
          <div className="amount-grid">
            {ucPackages.map((pkg, idx) => (
              <button 
                key={idx} 
                className={`package-card ${selectedPackage.uc === pkg.uc ? 'active' : ''}`}
                onClick={() => setSelectedPackage(pkg)}
              >
                <div className="package-icon">
                  <img src="https://www.freeiconspng.com/uploads/gold-coin-png-10.png" alt="UC" />
                </div>
                <div className="package-info">
                  <span className="uc-count">{pkg.uc} UC</span>
                  <span className="uzs-price">{pkg.price.toLocaleString()} UZS</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="payment-summary">
          <div className="summary-row">
            <span>Siz tanladingiz:</span>
            <strong>{selectedPackage.uc} UC</strong>
          </div>
          <div className="summary-row">
            <span>To'lov summasi:</span>
            <strong className="text-primary">{selectedPackage.price.toLocaleString()} UZS</strong>
          </div>
        </div>

        <div className="payment-methods">
          <h3>To'lov Usulini Tanlang</h3>
          <div className="methods-grid">
            <button 
              className="method-btn glass payme-btn" 
              onClick={() => handlePayment('payme')}
              disabled={loading}
            >
              <img src="https://cdn.payme.uz/logo/payme_color.svg" alt="Payme" />
              <span>Payme</span>
            </button>
            <button 
              className="method-btn glass click-btn" 
              onClick={() => handlePayment('click')}
              disabled={loading}
            >
              <img src="https://click.uz/click/images/click-logo.png" alt="Click" />
              <span>Click</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopUp;
