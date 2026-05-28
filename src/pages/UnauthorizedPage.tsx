import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  return (
    <div className="container text-center mt-5">
      <h1 className="display-1 text-muted">403</h1>
      <p className="lead">No tienes permiso para acceder a esta página</p>
      <button className="btn btn-primary" onClick={() => navigate('/')}>Volver al inicio</button>
    </div>
  );
};

export default UnauthorizedPage;
