import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App, { AppErrorBoundary } from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </StrictMode>,
)
/* cache bust Mar  2 jui 2026 11:28:16 CEST */
