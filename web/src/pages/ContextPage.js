import React from 'react';
import './ContextPage.css';
import { theme } from '../theme';
import CompanionAvatarWeb from '../components/CompanionAvatarWeb';

const ContextPage = () => {
  return (
    <div className="page-container" style={{ backgroundColor: theme.colors.background }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <CompanionAvatarWeb companion="secu" size={60} />
        <h2 style={{ color: theme.colors.secu, margin: 0 }}>Context Reader</h2>
      </header>
      <main>
        {/* Placeholder for Context Reader */}
        <p style={{ color: theme.colors.textMuted }}>Analyse de documents avec Secu</p>
      </main>
    </div>
  );
};

export default ContextPage;
