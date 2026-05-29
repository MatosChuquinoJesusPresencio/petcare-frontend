import { ROLES_USUARIO, ROL_LABEL } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import type { ReactNode } from 'react';

const Tooltip = ({ children, text }: { children: ReactNode; text: string }) => (
  <span className="position-relative" style={{ cursor: 'pointer' }}>
    <span className="d-inline-block" data-tooltip>{children}</span>
    <span className="tooltip-custom">{text}</span>
  </span>
);

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const staffRoles = ROLES_USUARIO.filter((r) => r !== 'DUENO');

  const navbarLinks = () => {
    const links: { label: string; to: string }[] = [{ label: 'Dashboard', to: '/' }];

    if (!user) return links;

    if (staffRoles.includes(user.role as typeof ROLES_USUARIO[number])) {
      links.push({ label: 'Servicios', to: '/servicios' });
      links.push({ label: 'Citas', to: '/citas' });
      links.push({ label: 'Mascotas', to: '/mascotas' });
    }

    if (user.role !== 'DUENO') {
      links.push({ label: 'Dueños', to: '/duenos' });
    }

    return links;
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-md bg-brand-gradient">
      <div className="container">
        <span className="navbar-brand text-white fw-bold" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          PetCare
        </span>

        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {navbarLinks().map((link) => (
              <li className="nav-item" key={link.to}>
                <span
                  className={`nav-link ${location.pathname === link.to ? 'text-white fw-semibold' : 'text-white-50'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(link.to)}
                >
                  {link.label}
                </span>
              </li>
            ))}
          </ul>

          {user && (
            <div className="d-flex align-items-center gap-3">
              <Tooltip text={`Nombre: ${user.username}\nRol: ${ROL_LABEL[user.role as keyof typeof ROL_LABEL] || user.role}`}>
                <FaUserCircle size={26} className="text-white" />
              </Tooltip>
              <button className="btn btn-outline-light btn-sm d-flex align-items-center gap-1" onClick={handleLogout}>
                <FiLogOut size={16} />
                Salir
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        [data-tooltip] + .tooltip-custom {
          visibility: hidden;
          opacity: 0;
          position: absolute;
          bottom: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(15, 23, 42, 0.9);
          color: #fff;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.75rem;
          white-space: pre-line;
          line-height: 1.4;
          pointer-events: none;
          transition: opacity 0.15s ease;
          z-index: 10;
        }
        [data-tooltip] + .tooltip-custom::before {
          content: '';
          position: absolute;
          top: -4px;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
          width: 6px;
          height: 6px;
          background: rgba(15, 23, 42, 0.9);
        }
        [data-tooltip]:hover + .tooltip-custom {
          visibility: visible;
          opacity: 1;
        }
      `}</style>
    </nav>
  );
};

export default Header;
