import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.js'

const rootElement = document.getElementById('root') || document.createElement('div');
if (!document.getElementById('root')) {
  rootElement.id = 'root';
  document.body.appendChild(rootElement);
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
