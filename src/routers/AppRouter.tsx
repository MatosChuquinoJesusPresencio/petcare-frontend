import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ServiciosPage from '../pages/ServiciosPage';
import CitasPage from '../pages/CitasPage';
import MascotasPage from '../pages/MascotasPage';
import DuenosPage from '../pages/DuenosPage';
import NotFoundPage from '../pages/NotFoundPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import { ProtectedRoute } from '../components/ProtectedRoute';
import MainLayout from '../layouts/MainLayout';

const staffRoles = ['ADMINISTRADOR', 'VETERINARIO', 'ASISTENTE'];

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/" element={<MainLayout><ProtectedRoute><DashboardPage /></ProtectedRoute></MainLayout>} />
      <Route path="/servicios" element={<MainLayout><ProtectedRoute allowedRoles={staffRoles}><ServiciosPage /></ProtectedRoute></MainLayout>} />
      <Route path="/citas" element={<MainLayout><ProtectedRoute allowedRoles={staffRoles}><CitasPage /></ProtectedRoute></MainLayout>} />
      <Route path="/mascotas" element={<MainLayout><ProtectedRoute allowedRoles={staffRoles}><MascotasPage /></ProtectedRoute></MainLayout>} />
      <Route path="/duenos" element={<MainLayout><ProtectedRoute allowedRoles={['ADMINISTRADOR', 'VETERINARIO', 'ASISTENTE']}><DuenosPage /></ProtectedRoute></MainLayout>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
