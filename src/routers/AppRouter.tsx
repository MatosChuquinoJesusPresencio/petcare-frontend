import { ROLES_USUARIO } from '../constants';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ServiciosPage from '../pages/ServiciosPage';
import CitasPage from '../pages/CitasPage';
import MascotasPage from '../pages/MascotasPage';
import DuenosPage from '../pages/DuenosPage';
import SalaEsperaPage from '../pages/SalaEsperaPage';
import TriajePage from '../pages/TriajePage';
import AtencionPage from '../pages/AtencionPage';
import VeterinariosPage from '../pages/VeterinariosPage';
import UsuariosPage from '../pages/UsuariosPage';
import AuditoriaPage from '../pages/AuditoriaPage';
import ConsentimientosPage from '../pages/ConsentimientosPage';
import SeguimientosPage from '../pages/SeguimientosPage';
import NotificacionesPage from '../pages/NotificacionesPage';
import NotFoundPage from '../pages/NotFoundPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import MainLayout from '../layouts/MainLayout';

const staffRoles = ROLES_USUARIO.filter((r) => r !== 'DUENO');

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/" element={<MainLayout><ProtectedRoute><DashboardPage /></ProtectedRoute></MainLayout>} />
      <Route path="/servicios" element={<MainLayout><ProtectedRoute allowedRoles={staffRoles}><ServiciosPage /></ProtectedRoute></MainLayout>} />
      <Route path="/citas" element={<MainLayout><ProtectedRoute allowedRoles={staffRoles}><CitasPage /></ProtectedRoute></MainLayout>} />
      <Route path="/mascotas" element={<MainLayout><ProtectedRoute allowedRoles={staffRoles}><MascotasPage /></ProtectedRoute></MainLayout>} />
      <Route path="/duenos" element={<MainLayout><ProtectedRoute allowedRoles={staffRoles}><DuenosPage /></ProtectedRoute></MainLayout>} />
      <Route path="/sala-espera" element={<MainLayout><ProtectedRoute allowedRoles={staffRoles}><SalaEsperaPage /></ProtectedRoute></MainLayout>} />
      <Route path="/triaje" element={<MainLayout><ProtectedRoute allowedRoles={staffRoles}><TriajePage /></ProtectedRoute></MainLayout>} />
      <Route path="/veterinarios" element={<MainLayout><ProtectedRoute allowedRoles={staffRoles}><VeterinariosPage /></ProtectedRoute></MainLayout>} />
      <Route path="/usuarios" element={<MainLayout><ProtectedRoute allowedRoles={['ADMINISTRADOR']}><UsuariosPage /></ProtectedRoute></MainLayout>} />
      <Route path="/atencion-clinica" element={<MainLayout><ProtectedRoute allowedRoles={staffRoles}><AtencionPage /></ProtectedRoute></MainLayout>} />
      <Route path="/auditoria" element={<MainLayout><ProtectedRoute allowedRoles={['ADMINISTRADOR']}><AuditoriaPage /></ProtectedRoute></MainLayout>} />
      <Route path="/consentimientos" element={<MainLayout><ProtectedRoute allowedRoles={staffRoles}><ConsentimientosPage /></ProtectedRoute></MainLayout>} />
      <Route path="/seguimientos" element={<MainLayout><ProtectedRoute allowedRoles={staffRoles}><SeguimientosPage /></ProtectedRoute></MainLayout>} />
      <Route path="/notificaciones" element={<MainLayout><ProtectedRoute allowedRoles={[...ROLES_USUARIO]}><NotificacionesPage /></ProtectedRoute></MainLayout>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
