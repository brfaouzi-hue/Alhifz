import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App, { AppErrorBoundary } from './App.jsx'

// Un ancien service worker (sw.js) enregistré il y a longtemps peut encore
// tourner sur les appareils qui l'ont installé avant qu'on arrête de le
// réenregistrer — sans ce nudge, ces installs restent figés sur d'anciens
// bundles pour toujours (voir la note dans public/sw.js). .update() force une
// vérification immédiate au lieu d'attendre le cycle du navigateur.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.update()));
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </StrictMode>,
)
/* cache bust Mar  2 jui 2026 11:28:16 CEST */
