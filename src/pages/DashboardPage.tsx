import { FaPaw, FaCalendarCheck, FaUserMd, FaHeart } from 'react-icons/fa';

const DashboardPage = () => (
  <div className="contenedor-pagina">
    <div className="container">
      <div className="panel-bienvenida animacion-entrada">
        <div>
          <h1>Panel de Control</h1>
          <p>Bienvenido al sistema de gestión PetCare</p>
        </div>
        <div className="panel-bienvenida-icono">
          <FaPaw />
        </div>
      </div>

      <div className="panel-tarjetas animacion-entrada" style={{ animationDelay: '0.1s' }}>
        <div className="panel-tarjeta">
          <div className="panel-tarjeta-icono">
            <FaCalendarCheck />
          </div>
          <p className="panel-tarjeta-titulo">Citas del día</p>
          <p className="panel-tarjeta-valor">--</p>
        </div>

        <div className="panel-tarjeta">
          <div className="panel-tarjeta-icono">
            <FaUserMd />
          </div>
          <p className="panel-tarjeta-titulo">Veterinarios</p>
          <p className="panel-tarjeta-valor">--</p>
        </div>

        <div className="panel-tarjeta">
          <div className="panel-tarjeta-icono">
            <FaPaw />
          </div>
          <p className="panel-tarjeta-titulo">Pacientes</p>
          <p className="panel-tarjeta-valor">--</p>
        </div>

        <div className="panel-tarjeta">
          <div className="panel-tarjeta-icono">
            <FaHeart />
          </div>
          <p className="panel-tarjeta-titulo">Servicios</p>
          <p className="panel-tarjeta-valor">--</p>
        </div>
      </div>
    </div>
  </div>
);

export default DashboardPage;
