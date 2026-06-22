import React, { useState } from 'react';
import './App.css';

const COMPANIONS = [
  { id: 'arch', name: 'Archlord', role: 'PDG & Admin', emoji: '👑' },
  { id: 'art', name: 'Art', role: 'Artiste Visuel', emoji: '🎨' },
  { id: 'ubu', name: 'Ubu', role: 'Humoriste', emoji: '🤖' },
  { id: 'bio', name: 'Bio', role: 'Créatif', emoji: '🌿' },
];

function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-section">
          <img src="/asset/logo/logo_sans_fond.png" alt="Viral Stick" className="logo" />
          <h1>Viral <span className="highlight">Stick</span></h1>
        </div>
        <nav className="main-nav">
          <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'active' : ''}>Tableau de bord</button>
          <button onClick={() => setActiveTab('forum')} className={activeTab === 'forum' ? 'active' : ''}>Forum</button>
          <button onClick={() => setActiveTab('about')} className={activeTab === 'about' ? 'active' : ''}>À propos</button>
        </nav>
      </header>

      <main className="app-content">
        {activeTab === 'home' && (
          <div className="dashboard">
            <section className="welcome-banner">
              <h2>Bienvenue sur le Studio Web</h2>
              <p>Générez vos mèmes et stickers avec la puissance de l'IA.</p>
            </section>

            <div className="modules-grid">
              <div className="module-card">
                <span className="module-icon">📖</span>
                <h3>Context Reader</h3>
                <p>Analysez vos discussions et créez des mèmes.</p>
                <button className="btn-primary">Lancer</button>
              </div>
              <div className="module-card">
                <span className="module-icon">🎙️</span>
                <h3>Voice to Meme</h3>
                <p>Transformez votre voix en sticker viral.</p>
                <button className="btn-primary">Lancer</button>
              </div>
            </div>

            <section className="companions-section">
              <h3>Nos Compagnons</h3>
              <div className="companions-grid">
                {COMPANIONS.map(c => (
                  <div key={c.id} className="companion-mini-card">
                    <img src={`/asset/compagnons/${c.id}_sans_fond.png`} alt={c.name} />
                    <h4>{c.name}</h4>
                    <p>{c.role}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="about-page">
            <h2>À propos de KERNEL FORGE</h2>
            <p>Viral Stick est un projet académique ICT202 de l'Université de Yaoundé I.</p>
            <div className="links">
              <a href="https://github.com/Archlord12345/VIRAL-STICK" target="_blank" rel="noreferrer">GitHub du Projet</a>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>KERNEL FORGE — 2026 | Viral Stick Web v1.0</p>
      </footer>
    </div>
  );
}

export default App;
