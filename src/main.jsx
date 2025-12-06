import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Vercel Analytics (framework-agnostic) - inject() is safe for Vite/react
try {
  // lazy require to avoid build-time issues in non-standard environments
  /* eslint-disable global-require */
  const { inject } = require('@vercel/analytics');
  if (typeof inject === 'function') inject();
} catch (e) {
  // analytics not available or optional - ignore in local/dev
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
