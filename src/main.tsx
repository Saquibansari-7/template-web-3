import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/site.css';

const rootEl = document.getElementById('root');
if (rootEl) {
  try {
    createRoot(rootEl).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (err) {
    console.error('Failed to mount React app:', err);
    rootEl.innerHTML = '<div style="padding: 20px; color: red; font-family: sans-serif;"><h2>React Mount Error</h2><pre>' + String(err) + '</pre></div>';
  }
} else {
  console.error('Root element #root not found');
  document.body.innerHTML += '<div style="padding: 20px; color: red; font-family: sans-serif;"><h2>Error: #root element not found</h2></div>';
}
