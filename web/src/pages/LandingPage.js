import React from 'react';
import './LandingPage.css';
import { theme } from '../theme';

const LandingPage = () => {
  return (
    <div className="landing-container" style={{ backgroundColor: theme.colors.background }}>
      <header className="header">
        <h1>Viral Stick</h1>
        <p>Générateur IA Multimodal</p>
      </header>
      
      <main className="main-content">
        <section className="hero">
          <h2>Votre plateforme créative tout-en-un.</h2>
          {/* Ici nous intégrerons les composants de compagnons */}
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
