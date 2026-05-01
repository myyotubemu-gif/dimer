import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { getCases, openCase, sellItem } from '../api';
import './CaseOpening.css';

function CaseOpening() {
  const { id } = useParams();
  const { user, token, updateBalance, fetchProfile } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const [isOpening, setIsOpening] = useState(false);
  const [wonItem, setWonItem] = useState(null);
  const [wonInventoryId, setWonInventoryId] = useState(null);
  const [targetCase, setTargetCase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSelling, setIsSelling] = useState(false);

  useEffect(() => {
    getCases()
      .then(cases => {
        const found = cases.find(c => c.id === id);
        setTargetCase(found);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleOpen = async () => {
    if (!user) {
      showToast("Iltimos, oldin tizimga kiring!", "info");
      return;
    }
    if (user.balanceUC < targetCase.priceUC) {
      showToast("Balansingizda yetarli UC yo'q!", "error");
      return;
    }

    setIsOpening(true);
    setWonItem(null);
    setWonInventoryId(null);
    
    try {
      const data = await openCase(targetCase.id, token);
      
      // Simulate roulette delay
      setTimeout(() => {
        setIsOpening(false);
        setWonItem(data.wonItem);
        setWonInventoryId(data.inventoryId);
        fetchProfile(token); // To update inventory in global state
        showToast(`Tabriklaymiz! ${data.wonItem.name} yutdingiz!`, "success");
      }, 3000);
    } catch (err) {
      showToast(err.message, "error");
      setIsOpening(false);
    }
  };

  const handleSell = async () => {
    if(!wonInventoryId || isSelling) return;
    setIsSelling(true);
    try {
      const res = await sellItem(wonInventoryId, token);
      showToast(`Sotildi! +${res.soldFor} UC balansingizga qo'shildi.`, "success");
      setWonItem(null);
      setWonInventoryId(null);
      fetchProfile(token); // Update UI
    } catch(err) {
      showToast(err.message, "error");
    } finally {
      setIsSelling(false);
    }
  };

  if (loading) return <div className="case-opening-page animate-fade-in"><h2>Yuklanmoqda...</h2></div>;
  if (!targetCase) return <div className="case-opening-page animate-fade-in"><h2>Keys topilmadi</h2></div>;

  const items = targetCase.items;

  return (
    <div className="case-opening-page animate-fade-in">
      <div className="back-link">
        <Link to="/">← Ortga qaytish</Link>
      </div>

      <div className="case-view glass glass-glow">
        <h2>{targetCase.name}</h2>
        
        <div className="roulette-container">
          <div className="roulette-window">
            <div className="roulette-pointer">▼</div>
            <div className={`roulette-items ${isOpening ? 'spinning' : ''}`}>
              {/* Duplicate items to create long strip for animation */}
              {[...items, ...items, ...items, ...items].map((item, idx) => (
                <div key={idx} className={`r-item tier-${item.type}`}>
                  <img src={item.image} alt={item.name} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {wonItem && (
          <div className="win-modal animate-fade-in glass">
            <h3>Tabriklaymiz!</h3>
            <div className={`won-item tier-${wonItem.type}`}>
              <img src={wonItem.image} alt={wonItem.name} />
              <h4>{wonItem.name}</h4>
              <p className="item-price">Qayta sotish: <span>{wonItem.sellPriceUC} UC</span></p>
            </div>
            <div className="win-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '15px' }}>
              <button className="btn btn-secondary" onClick={() => {setWonItem(null); setWonInventoryId(null);}}>Olib Qolish</button>
              <button className="btn btn-primary" onClick={handleSell} disabled={isSelling}>
                {isSelling ? 'Sotilmoqda...' : `Sotish (+${wonItem.sellPriceUC} UC)`}
              </button>
            </div>
          </div>
        )}

        <div className="case-actions">
          <button 
            className="btn btn-primary btn-open" 
            onClick={handleOpen}
            disabled={isOpening}
          >
            {isOpening ? 'Ochilmoqda...' : `Ochish - ${targetCase.priceUC} UC`}
          </button>
        </div>
      </div>

      <div className="case-contents glass">
        <h3>Keys ichidagi narsalar</h3>
        <div className="contents-grid">
          {items.map(item => (
            <div key={item.id} className={`content-item tier-${item.type}`}>
              <img src={item.image} alt={item.name} />
              <span>{item.name}</span>
              <div className="sell-price-tag">Sotish: {item.sellPriceUC} UC</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CaseOpening;
