import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCases } from '../api';
import './Home.css';

function Home() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCases()
      .then(data => {
        setCases(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="home-page animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}><h2>Yuklanmoqda...</h2></div>;
  }

  return (
    <div className="home-page animate-fade-in">
      <section className="hero text-center">
        <h1>Eng Zo'r <span>PUBG</span> Keyslar</h1>
        <p>O'z omadingizni sinab ko'ring va eng kamyob skinlarni yutib oling!</p>
      </section>

      <section className="cases-section">
        <h2>Ommabop Keyslar</h2>
        <div className="cases-grid">
          {cases.map((c) => (
            <Link to={`/case/${c.id}`} key={c.id} className={`case-card glass tier-${c.type}`}>
              <div className="case-image-wrap">
                <img src={c.image} alt={c.name} />
              </div>
              <div className="case-info">
                <h3>{c.name}</h3>
                <div className="case-price" style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center' }}>
                  <img src="https://pubgmobile.uz/images/uc-coin.png" alt="UC" style={{ width: '18px', height: '18px', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline'; }} />
                  <span style={{ display: 'none' }}>UC</span>
                  {c.priceUC.toLocaleString()}
                </div>
              </div>
              <div className="case-hover-action">
                <span className="btn btn-primary">Ochish</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
