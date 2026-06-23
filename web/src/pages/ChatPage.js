import React from 'react';
import './ChatPage.css';
import { theme } from '../theme';
import CompanionAvatarWeb from '../components/CompanionAvatarWeb';

const ChatPage = () => {
  return (
    <div className="page-container" style={{ backgroundColor: theme.colors.background }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <CompanionAvatarWeb companion="data" size={60} />
        <h2 style={{ color: theme.colors.data, margin: 0 }}>Companion Chat</h2>
      </header>
      <main>
        {/* Placeholder for Chat Interface */}
        <p style={{ color: theme.colors.textMuted }}>Interface de discussion avec Data</p>
      </main>
    </div>
  );
};

export default ChatPage;
