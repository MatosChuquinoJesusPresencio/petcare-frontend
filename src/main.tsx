import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './providers/AuthProvider.tsx'

import App from './App.tsx'

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
)
