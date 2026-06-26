import React from 'react';
import ReactDOM from 'react-dom/client';
import './firebase'; // Initialise Firebase avant tout le reste
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
