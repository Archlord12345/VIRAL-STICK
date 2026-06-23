import React, { useState } from 'react';
import './RemixPage.css';
import { theme } from '../theme';
import CompanionAvatarWeb from '../components/CompanionAvatarWeb';

const RemixPage = () => {
  const [remixText, setRemixText] = useState('');
  const [result, setResult] = useState('');

  const handleRemix = () => {
    setResult(`Remix généré pour: ${remixText}`);
  };

  return (
    <div className="page-container" style={{ backgroundColor: theme.colors.background, padding: '20px' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: theme.colors.art, marginBottom: '1rem' }}>Remix Studio</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <CompanionAvatarWeb companion="art" size={50} />
          <CompanionAvatarWeb companion="ubu" size={50} />
        </div>
      </header>
      <main>
        <textarea 
          value={remixText}
          onChange={(e) => setRemixText(e.target.value)}
          placeholder="Entrez votre texte à remixer..."
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <button onClick={handleRemix} style={{ padding: '10px 20px' }}>Remixer !</button>
        {result && <p style={{ marginTop: '20px', color: 'white' }}>{result}</p>}
      </main>
    </div>
  );
};

export default RemixPage;
