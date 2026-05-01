import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Header from './components/Header';
import Home from './pages/Home';
import CaseOpening from './pages/CaseOpening';
import TopUp from './pages/TopUp';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import './index.css';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Header />
          <main className="container" style={{ flex: 1, padding: '2rem 1.5rem' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/case/:id" element={<CaseOpening />} />
              <Route path="/topup" element={<TopUp />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin-secret" element={<AdminPanel />} />
            </Routes>
          </main>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
