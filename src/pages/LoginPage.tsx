import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Logo from '../components/common/Logo';
import { getErrorMessage } from '../utils/errorHandler';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    const cleanEmail = email.trim();

    try {
      await login({ email: cleanEmail, password });
    } catch (err) {
      setErrorMsg(getErrorMessage(err));
      setPassword('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="inicio-sesion">
      <div className="inicio-sesion-tarjeta">
        <div className="inicio-sesion-logo">
          <Logo height={52} />
        </div>

        <h1 className="inicio-sesion-titulo">Bienvenido</h1>
        <p className="inicio-sesion-subtitulo">Ingresa a tu cuenta para continuar</p>

        {errorMsg && (
          <div className="inicio-sesion-error">
            <i className="bi bi-exclamation-triangle-fill me-1"></i>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="campo-grupo">
            <label className="campo-etiqueta">Correo electrónico</label>
            <div className="d-flex align-items-stretch">
              <span style={{
                display: 'flex', alignItems: 'center', padding: '0.5rem 0.75rem',
                background: 'var(--color-fondo)', border: '1.5px solid var(--color-borde)',
                borderRight: 'none', borderRadius: 'var(--radio-borde) 0 0 var(--radio-borde)',
                color: 'var(--color-texto-secundario)'
              }}>
                <i className="bi bi-envelope-fill"></i>
              </span>
              <input
                type="email"
                className="campo-entrada"
                style={{ borderRadius: '0 var(--radio-borde) var(--radio-borde) 0' }}
                placeholder="Ingresa tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="campo-grupo">
            <label className="campo-etiqueta">Contraseña</label>
            <div className="d-flex align-items-stretch">
              <span style={{
                display: 'flex', alignItems: 'center', padding: '0.5rem 0.75rem',
                background: 'var(--color-fondo)', border: '1.5px solid var(--color-borde)',
                borderRight: 'none', borderRadius: 'var(--radio-borde) 0 0 var(--radio-borde)',
                color: 'var(--color-texto-secundario)'
              }}>
                <i className="bi bi-lock-fill"></i>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                className="campo-entrada"
                style={{ borderRadius: '0', borderRight: 'none' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="boton boton--neutro"
                style={{ borderRadius: '0 var(--radio-borde) var(--radio-borde) 0', borderLeft: 'none' }}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
              </button>
            </div>
          </div>

          <button type="submit" className="boton boton--primario boton--grande inicio-sesion-enviar" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="inicio-sesion-cargando">
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Ingresando...
              </span>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
