import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { CommerceProvider } from './commerce/CommerceContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CommerceProvider>
        <App />
      </CommerceProvider>
    </BrowserRouter>
  </StrictMode>,
)
