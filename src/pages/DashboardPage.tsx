import { useEffect, useState } from 'react';
import { FaPaw, FaCalendarCheck, FaUserMd, FaHeart } from 'react-icons/fa';
import { getServicios, obtenerCitas, obtenerMascotas, obtenerVeterinarios } from '../services';

const DashboardPage = () => {
  const [citasHoy, setCitasHoy] = useState<number | string>('--');
  const [veterinarios, setVeterinarios] = useState<number | string>('--');
  const [pacientes, setPacientes] = useState<number | string>('--');
  const [servicios, setServicios] = useState<number | string>('--');

  useEffect(() => {
    const load = async () => {
      try {
        const hoyStr = new Date().toISOString().split('T')[0];
        const [citasData, vetsData, mascotasData, serviciosData] = await Promise.all([
          obtenerCitas({ fechaDesde: hoyStr + 'T00:00:00', fechaHasta: hoyStr + 'T23:59:59' }),
          obtenerVeterinarios(),
          obtenerMascotas({ activo: true }),
          getServicios({ soloActivos: true }),
        ]);
        setCitasHoy(citasData.length);
        setVeterinarios(vetsData.length);
        setPacientes(mascotasData.length);
        setServicios(serviciosData.length);
      } catch {
        console.error('Error loading dashboard data');
      }
    };
    const t = setTimeout(load);
    return () => clearTimeout(t);
  }, []);

  return (
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
            <p className="panel-tarjeta-valor">{citasHoy}</p>
          </div>

          <div className="panel-tarjeta">
            <div className="panel-tarjeta-icono">
              <FaUserMd />
            </div>
            <p className="panel-tarjeta-titulo">Veterinarios</p>
            <p className="panel-tarjeta-valor">{veterinarios}</p>
          </div>

          <div className="panel-tarjeta">
            <div className="panel-tarjeta-icono">
              <FaPaw />
            </div>
            <p className="panel-tarjeta-titulo">Pacientes</p>
            <p className="panel-tarjeta-valor">{pacientes}</p>
          </div>

          <div className="panel-tarjeta">
            <div className="panel-tarjeta-icono">
              <FaHeart />
            </div>
            <p className="panel-tarjeta-titulo">Servicios</p>
            <p className="panel-tarjeta-valor">{servicios}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
