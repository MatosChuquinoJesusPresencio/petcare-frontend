import { useState, useEffect, useCallback } from 'react';
import { ROL_LABEL } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { FiLogOut, FiMenu, FiX, FiHome, FiList, FiCalendar, FiHeart, FiUsers, FiClock, FiClipboard, FiUserCheck, FiActivity } from 'react-icons/fi';
import Logo from '../common/Logo';

interface Enlace {
  label: string;
  to: string;
  icon: React.ReactNode;
}

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [abierto, setAbierto] = useState(window.innerWidth > 768);
  const [esMovil, setEsMovil] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const movil = window.innerWidth <= 768;
      setEsMovil(movil);
      if (movil) setAbierto(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('sidebar-expandida', !esMovil && abierto);
    document.documentElement.classList.toggle('sidebar-colapsada', !esMovil && !abierto);
    return () => {
      document.documentElement.classList.remove('sidebar-expandida', 'sidebar-colapsada');
    };
  }, [abierto, esMovil]);

  const puedeVer = (roles: string[]) => user !== null && roles.includes(user.role);
  const enlaces: Enlace[] = [
    { label: 'Dashboard', to: '/', icon: <FiHome /> },
    ...(user && user.role !== 'DUENO'
      ? [
          { label: 'Servicios', to: '/servicios', icon: <FiList /> },
          { label: 'Citas', to: '/citas', icon: <FiCalendar /> },
          { label: 'Mascotas', to: '/mascotas', icon: <FiHeart /> },
          { label: 'Dueños', to: '/duenos', icon: <FiUsers /> },
          { label: 'Sala Espera', to: '/sala-espera', icon: <FiClock /> },
          { label: 'Triaje', to: '/triaje', icon: <FiClipboard /> },
          { label: 'Atención Clínica', to: '/atencion-clinica', icon: <FiActivity /> },
          ...(puedeVer(['ADMINISTRADOR', 'ASISTENTE']) ? [{ label: 'Veterinarios', to: '/veterinarios', icon: <FiUserCheck /> }] : []),
        ]
      : []),
  ];

  const toggle = useCallback(() => setAbierto((prev) => !prev), []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navegar = useCallback((to: string) => {
    navigate(to);
    if (esMovil) setAbierto(false);
  }, [navigate, esMovil]);

  return (
    <>
      {/* Mobile header bar */}
      {esMovil && (
        <div className="barra-lateral-header-movil">
          <button
            className="barra-lateral-toggle-movil"
            onClick={toggle}
            aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
          >
            {abierto ? <FiX /> : <FiMenu />}
          </button>
          <div className="barra-lateral-logo-movil" onClick={() => navegar('/')}>
            <Logo blanco height={32} />
          </div>
        </div>
      )}

      {/* Overlay for mobile */}
      {esMovil && abierto && <div className="barra-lateral-overlay" onClick={() => setAbierto(false)} />}

      {/* Desktop toggle button: inside the sidebar when open, floating when closed */}
      {!esMovil && !abierto && (
        <button className="barra-lateral-toggle-desktop" onClick={toggle} aria-label="Abrir menú">
          <FiMenu />
        </button>
      )}

      {/* Sidebar */}
      <aside className={`barra-lateral${abierto ? ' barra-lateral--abierto' : ''}`}>
        <div className="barra-lateral-logo">
          <Logo blanco height={48} />
          {!esMovil && (
            <button className="barra-lateral-toggle-inner" onClick={toggle} aria-label="Cerrar menú">
              <FiX />
            </button>
          )}
        </div>

        <nav>
          <ul className="barra-lateral-enlaces">
            {enlaces.map((link) => (
              <li key={link.to}>
                <button
                  className={`barra-lateral-enlace${location.pathname === link.to ? ' barra-lateral-enlace--activo' : ''}`}
                  onClick={() => navegar(link.to)}
                >
                  <span className="barra-lateral-icono">{link.icon}</span>
                  <span className="barra-lateral-etiqueta">{link.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {user && (
          <div className="barra-lateral-pie">
            <div className="barra-lateral-usuario">
              <span className="barra-lateral-usuario-icono">
                <FaUserCircle size={20} />
              </span>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div className="barra-lateral-usuario-nombre">{user.email}</div>
                <div className="barra-lateral-usuario-rol">
                  {ROL_LABEL[user.role as keyof typeof ROL_LABEL] || user.role}
                </div>
              </div>
            </div>
            <button className="barra-lateral-boton-salir" onClick={handleLogout}>
              <FiLogOut size={16} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Header;
