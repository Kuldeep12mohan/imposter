import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MyProvider } from './context/context.jsx'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MyProvider>
    <App />
    </MyProvider>
  </StrictMode>
)