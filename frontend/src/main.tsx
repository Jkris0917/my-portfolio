import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#161B22',
          border: '1px solid #21262D',
          color: '#E6EDF3',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '13px',
        },
      }}
    />
  </StrictMode>,
)