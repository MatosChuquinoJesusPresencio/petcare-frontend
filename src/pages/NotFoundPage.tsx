import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="error-pagina">
      <div className="error-tarjeta">
        <h1 className="error-codigo">404</h1>
        <p className="error-message">Página no encontrada</p>
        <button className="boton boton--primario error-accion" onClick={() => navigate('/')}>
          Ir al inicio
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
