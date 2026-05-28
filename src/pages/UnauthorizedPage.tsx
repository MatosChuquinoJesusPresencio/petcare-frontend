import { useNavigate } from 'react-router-dom';
import '../css/pages/ErrorPage.css';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  return (
    <div className="fullscreen-bg">
      <div className="glass-card error-card">
        <h1 className="error-code">403</h1>
        <p className="error-message">No tienes permiso para acceder a esta página</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
