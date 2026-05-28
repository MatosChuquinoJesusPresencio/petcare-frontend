import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="container text-center mt-5">
      <h1 className="display-1 text-muted">404</h1>
      <p className="lead">Página no encontrada</p>
      <button className="btn btn-primary" onClick={() => navigate('/')}>Ir al inicio</button>
    </div>
  );
};

export default NotFoundPage;
