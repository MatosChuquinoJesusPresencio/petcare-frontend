import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ServiciosPage from '../pages/ServiciosPage';
import CitasPage from '../pages/CitasPage';
import MascotasPage from '../pages/MascotasPage';
import NotFoundPage from '../pages/NotFoundPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import { ProtectedRoute } from '../components/ProtectedRoute';

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/servicios" element={<ProtectedRoute allowedRoles={['ADMINISTRADOR']}><ServiciosPage /></ProtectedRoute>} />
      <Route path="/citas" element={<ProtectedRoute allowedRoles={['VETERINARIO', 'ASISTENTE']}><CitasPage /></ProtectedRoute>} />
      <Route path="/mascotas" element={<ProtectedRoute allowedRoles={['DUENO']}><MascotasPage /></ProtectedRoute>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
