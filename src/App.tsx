import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';

const LogoutButton = () => {
  const { logout } = useAuth();
  return <button className="btn btn-sm btn-outline-danger ms-3" onClick={logout}>Cerrar Sesión</button>;
};

// Componentes temporales para demostrar las rutas protegidas
const Servicios = () => <div><h2>Vista de Servicios (Admin)</h2><LogoutButton /></div>;
const Citas = () => <div><h2>Vista de Citas (Veterinario / Asistente)</h2><LogoutButton /></div>;
const Mascotas = () => <div><h2>Vista de Mascotas (Dueño)</h2><LogoutButton /></div>;

const MainApp = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      
      {/* Rutas Protegidas */}
      <Route 
        path="/servicios" 
        element={
          <ProtectedRoute allowedRoles={['ADMINISTRADOR']}>
            <Servicios />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/citas" 
        element={
          <ProtectedRoute allowedRoles={['VETERINARIO', 'ASISTENTE']}>
            <Citas />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/mascotas" 
        element={
          <ProtectedRoute allowedRoles={['DUENO']}>
            <Mascotas />
          </ProtectedRoute>
        } 
      />
      
      {/* Ruta por defecto o Dashboard */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <div className="container mt-4">
              <h1>Bienvenido a PetCare</h1>
              <p>Has iniciado sesión como: {user?.username} ({user?.role})</p>
              <LogoutButton />
            </div>
          </ProtectedRoute>
        } 
      />

      {/* Catch-all para URLs inexistentes o no autorizadas */}
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <MainApp />
      </Router>
    </AuthProvider>
  );
};

export default App;
