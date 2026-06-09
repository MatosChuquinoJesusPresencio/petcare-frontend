import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  return (
    <div className="error-pagina">
      <div className="error-tarjeta">
        <h1 className="error-codigo">403</h1>
        <p className="error-message">No tienes permiso para acceder a esta página</p>
        <button className="boton boton--primario error-accion" onClick={() => navigate('/')}>
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
