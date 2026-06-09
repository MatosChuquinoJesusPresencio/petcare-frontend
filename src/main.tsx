import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './providers/AuthProvider.tsx'

import App from './App.tsx'

import "./css/tokens.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./css/base.css";
import "./css/componentes/barra-navegacion.css";
import "./css/componentes/barra-lateral.css";
import "./css/componentes/botones.css";
import "./css/componentes/tabla.css";
import "./css/componentes/dialogo.css";
import "./css/componentes/formulario.css";
import "./css/componentes/etiqueta.css";
import "./css/componentes/notificacion.css";
import "./css/componentes/encabezado-pagina.css";
import "./css/paginas/inicio-sesion.css";
import "./css/paginas/error.css";
import "./css/paginas/panel.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
)
