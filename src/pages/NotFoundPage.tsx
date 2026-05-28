import { useNavigate } from 'react-router-dom';
import '../css/pages/ErrorPage.css';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="fullscreen-bg">
      <div className="glass-card error-card">
        <h1 className="error-code">404</h1>
        <p className="error-message">Página no encontrada</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Ir al inicio</button>
      </div>
    </div>
  );
};

export default NotFoundPage;
