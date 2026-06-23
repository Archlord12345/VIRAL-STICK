import React from 'react';
import './RemixPage.css';
import { theme } from '../theme';
import CompanionAvatarWeb from '../components/CompanionAvatarWeb';

const RemixPage = () => {
  return (
    <div className="page-container" style={{ backgroundColor: theme.colors.background }}>
      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: theme.colors.art, marginBottom: '1rem' }}>Remix Studio</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <CompanionAvatarWeb companion="art" size={50} />
          <CompanionAvatarWeb companion="ubu" size={50} />
        </div>
      </header>
      <main>
        {/* Placeholder for Remix Interface */}
        <p style={{ color: theme.colors.textMuted }}>Interface de remix avec Art & Ubu</p>
      </main>
    </div>
  );
};

export default RemixPage;
