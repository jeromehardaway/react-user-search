import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.js'

// Create a fallback element if root is not found
const rootElement = document.getElementById('root') || document.createElement('div');
if (!document.getElementById('root')) {
  rootElement.id = 'root';
  document.body.appendChild(rootElement);
}

// Create the React root and render
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
