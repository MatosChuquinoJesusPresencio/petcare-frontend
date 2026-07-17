import { useState, useEffect, useCallback, useRef } from 'react';
import { ROL_LABEL } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { FiLogOut, FiMenu, FiX, FiHome, FiList, FiCalendar, FiHeart, FiUsers, FiClock, FiClipboard, FiUserCheck, FiActivity, FiCheckSquare, FiBell, FiFileText, FiKey } from 'react-icons/fi';
import Logo from '../common/Logo';
import BaseFormDialog from '../common/BaseFormDialog';
import NotificationToast from '../common/NotificationToast';
import type { ToastInfo } from '../common/NotificationToast';
import { getErrorMessage } from '../../utils/errorHandler';
import { notificacionService } from '../../services/notificacionService';
import { cambiarContrasena } from '../../services/usuarioService';
import type { NotificacionResponse } from '../../types/notificacionType';

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
  const [noLeidas, setNoLeidas] = useState(0);
  const [notificaciones, setNotificaciones] = useState<NotificacionResponse[]>([]);
  const [mostrarNotif, setMostrarNotif] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const [showCambiarPass, setShowCambiarPass] = useState(false);
  const [passForm, setPassForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passFormErrors, setPassFormErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<ToastInfo | null>(null);

  useEffect(() => {
    if (!user) return;
    const cargar = async () => {
      try {
        const [count, lista] = await Promise.all([
          notificacionService.contarNoLeidas(user.id),
          notificacionService.listarPorUsuario(user.id),
        ]);
        setNoLeidas(count);
        setNotificaciones(lista.slice(0, 10));
      } catch { /* silent */ }
    };
    cargar();
    const interval = setInterval(cargar, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setMostrarNotif(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          { label: 'Consentimientos', to: '/consentimientos', icon: <FiFileText /> },
          { label: 'Seguimientos', to: '/seguimientos', icon: <FiCheckSquare /> },
          ...(puedeVer(['ADMINISTRADOR', 'ASISTENTE']) ? [{ label: 'Veterinarios', to: '/veterinarios', icon: <FiUserCheck /> }] : []),
          ...(puedeVer(['ADMINISTRADOR']) ? [{ label: 'Usuarios', to: '/usuarios', icon: <FiUsers /> }] : []),
          ...(puedeVer(['ADMINISTRADOR', 'ASISTENTE', 'VETERINARIO', 'DUENO']) ? [{ label: 'Notificaciones', to: '/notificaciones', icon: <FiBell /> }] : []),
          ...(puedeVer(['ADMINISTRADOR']) ? [{ label: 'Auditoría', to: '/auditoria', icon: <FiCheckSquare /> }] : []),
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

  const handleMarcarLeidas = async () => {
    if (!user) return;
    try {
      await notificacionService.marcarComoLeidas(user.id);
      setNoLeidas(0);
      setNotificaciones((prev) => prev.map((n) => ({ ...n, leido: true })));
    } catch { /* silent */ }
  };

  const handleCambiarPassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!passForm.currentPassword) errors.currentPassword = "La contraseña actual es obligatoria.";
    if (!passForm.newPassword) errors.newPassword = "La nueva contraseña es obligatoria.";
    else if (passForm.newPassword.length < 6) errors.newPassword = "Mínimo 6 caracteres.";
    if (passForm.newPassword !== passForm.confirmPassword) errors.confirmPassword = "Las contraseñas no coinciden.";
    if (Object.keys(errors).length > 0) { setPassFormErrors(errors); return; }
    setPassFormErrors({});
    try {
      await cambiarContrasena(passForm);
      setShowCambiarPass(false);
      setPassForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setToast({ message: "Contraseña cambiada correctamente.", type: "success" });
    } catch (err) {
      setToast({ message: getErrorMessage(err), type: "error" });
    }
  };

  return (
    <>
      <NotificationToast toast={toast} onClose={() => setToast(null)} />
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
              <div ref={notifRef} style={{ position: 'relative' }}>
                <button
                  className="barra-lateral-boton-salir"
                  onClick={() => setMostrarNotif(!mostrarNotif)}
                  title="Notificaciones"
                  style={{ position: 'relative' }}
                >
                  <FiBell size={18} />
                  {noLeidas > 0 && (
                    <span style={{
                      position: 'absolute', top: -4, right: -4,
                      background: '#ef4444', color: '#fff', borderRadius: '50%',
                      fontSize: 10, width: 16, height: 16, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', fontWeight: 700,
                    }}>
                      {noLeidas > 99 ? '99+' : noLeidas}
                    </span>
                  )}
                </button>
                {mostrarNotif && (
                  <div style={{
                    position: 'absolute', bottom: '100%', left: 0, marginBottom: 8,
                    width: 320, maxHeight: 400, overflowY: 'auto',
                    background: '#fff', borderRadius: 8, boxShadow: '0 4px 24px rgba(0,0,0,.15)',
                    zIndex: 1000, padding: 0,
                  }}>
                    <div style={{ padding: '10px 14px', fontWeight: 600, borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Notificaciones</span>
                      {noLeidas > 0 && (
                        <button onClick={handleMarcarLeidas} style={{ background: 'none', border: 'none', color: 'var(--color-primario)', cursor: 'pointer', fontSize: 12 }}>
                          Marcar como leídas
                        </button>
                      )}
                    </div>
                    {notificaciones.length === 0 ? (
                      <div style={{ padding: 20, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>Sin notificaciones</div>
                    ) : (
                      notificaciones.map((n) => (
                        <div key={n.id} style={{
                          padding: '10px 14px', borderBottom: '1px solid #f3f4f6',
                          background: n.leido ? '#fff' : '#eff6ff', fontSize: 13,
                        }}>
                          <div style={{ color: '#374151' }}>{n.mensaje}</div>
                          <div style={{ color: '#9ca3af', fontSize: 11, marginTop: 2 }}>
                            {new Date(n.creadoEn).toLocaleString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
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
            <button className="barra-lateral-boton-salir" onClick={() => setShowCambiarPass(true)}>
              <FiKey size={16} />
              <span>Cambiar contraseña</span>
            </button>
            <button className="barra-lateral-boton-salir" onClick={handleLogout}>
              <FiLogOut size={16} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        )}
      </aside>

      <BaseFormDialog
        isOpen={showCambiarPass}
        onClose={() => { setShowCambiarPass(false); setPassFormErrors({}); setPassForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); }}
        onSubmit={handleCambiarPassSubmit}
        title="Cambiar Contraseña"
        submitLabel="Guardar"
        isSubmitting={false}
        submitError=""
        modalId="cambiarPassModal"
        size="sm"
      >
        <div className="campo-grupo">
          <label className="campo-etiqueta">Contraseña actual *</label>
          <input type="password" className={`campo-entrada ${passFormErrors.currentPassword ? 'campo-entrada--error' : ''}`} value={passForm.currentPassword} onChange={(e) => { setPassForm((p) => ({ ...p, currentPassword: e.target.value })); setPassFormErrors((p) => { const n = { ...p }; delete n.currentPassword; return n; }); }} required />
          {passFormErrors.currentPassword && <div className="campo-error">{passFormErrors.currentPassword}</div>}
        </div>
        <div className="campo-grupo">
          <label className="campo-etiqueta">Nueva contraseña *</label>
          <input type="password" className={`campo-entrada ${passFormErrors.newPassword ? 'campo-entrada--error' : ''}`} value={passForm.newPassword} onChange={(e) => { setPassForm((p) => ({ ...p, newPassword: e.target.value })); setPassFormErrors((p) => { const n = { ...p }; delete n.newPassword; return n; }); }} required />
          {passFormErrors.newPassword && <div className="campo-error">{passFormErrors.newPassword}</div>}
        </div>
        <div className="campo-grupo">
          <label className="campo-etiqueta">Confirmar contraseña *</label>
          <input type="password" className={`campo-entrada ${passFormErrors.confirmPassword ? 'campo-entrada--error' : ''}`} value={passForm.confirmPassword} onChange={(e) => { setPassForm((p) => ({ ...p, confirmPassword: e.target.value })); setPassFormErrors((p) => { const n = { ...p }; delete n.confirmPassword; return n; }); }} required />
          {passFormErrors.confirmPassword && <div className="campo-error">{passFormErrors.confirmPassword}</div>}
        </div>
      </BaseFormDialog>
    </>
  );
};

export default Header;
