import React, { useState } from 'react';
import './ContextPage.css';
import { theme } from '../theme';
import CompanionAvatarWeb from '../components/CompanionAvatarWeb';

const ContextPage = () => {
  const [context, setContext] = useState('');

  return (
    <div className="page-container" style={{ backgroundColor: theme.colors.background, padding: '20px' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <CompanionAvatarWeb companion="secu" size={60} />
        <h2 style={{ color: theme.colors.secu, margin: 0 }}>Context Reader</h2>
      </header>
      <main>
        <textarea 
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Collez votre texte de contexte ici..."
          style={{ width: '100%', height: '200px', padding: '10px' }}
        />
        <button style={{ marginTop: '10px', padding: '10px 20px' }}>Analyser le contexte</button>
      </main>
    </div>
  );
};

export default ContextPage;
