import { useEffect, useState } from "react";

import type { Dueno } from "../../types";
import { getDuenos, cambiarDuenoPrincipal } from "../../services";
import NotificationToast from "../common/NotificationToast";
import type { ToastInfo } from "../common/NotificationToast";

interface Props {
  show: boolean;
  mascotaId: number | null;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

export default function MascotaVincularModal({
  show,
  mascotaId,
  onClose,
  onSuccess,
}: Props) {
  const [duenos, setDuenos] = useState<Dueno[]>([]);
  const [duenoId, setDuenoId] = useState(0);
  const [relacion, setRelacion] = useState("Tutor");
  const [toast, setToast] = useState<ToastInfo | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const cargarDuenos = async () => {
    try {
      const data = await getDuenos();
      setDuenos(data);
    } catch (error) {
      console.error(error);
      setToast({ message: "No se pudieron cargar los dueños.", type: "error" });
    }
  };

  useEffect(() => {
    if (show) {
      const t = setTimeout(cargarDuenos);
      return () => clearTimeout(t);
    }
  }, [show]);

  const validate = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!duenoId) {
      errors.duenoId = "Selecciona un dueño.";
    }
    if (!relacion.trim()) {
      errors.relacion = "La relación es obligatoria.";
    } else if (relacion.trim().length < 2) {
      errors.relacion = "Mínimo 2 caracteres.";
    } else if (relacion.trim().length > 50) {
      errors.relacion = "Máximo 50 caracteres.";
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mascotaId) return;

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    try {
      await cambiarDuenoPrincipal(mascotaId, { ownerId: duenoId, relation: relacion, reason: "Cambio manual desde el sistema" });
      await onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      setToast({ message: "No se pudo vincular el dueño.", type: "error" });
    }
  };

  if (!show) return null;

  return (
    <>
      <NotificationToast toast={toast} onClose={() => setToast(null)} />
      <div className="dialogo-fondo" onClick={onClose}></div>
      <div className="dialogo-contenedor">
        <div className="dialogo-ventana">
          <div className="dialogo-encabezado">
            <h5 className="dialogo-titulo">
              <i className="bi bi-person-plus me-1"></i>
              Cambiar Dueño Principal
            </h5>
            <button type="button" className="dialogo-cerrar" onClick={onClose}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          <div className="dialogo-cuerpo">
            <form onSubmit={handleSubmit}>
              <div className="campo-grupo">
                <label className="campo-etiqueta">Dueño</label>
                <select
                  className={`campo-entrada ${fieldErrors.duenoId ? 'campo-entrada--error' : ''}`}
                  value={duenoId}
                  onChange={(e) => { setDuenoId(Number(e.target.value)); setFieldErrors((p) => { const n = { ...p }; delete n.duenoId; return n; }); }}
                  required
                >
                  <option value="">Seleccione dueño</option>
                  {duenos.map((dueno) => (
                    <option key={dueno.id} value={dueno.id}>
                      {dueno.usuario ? `${dueno.usuario.names} ${dueno.usuario.lastNames}` : `DNI: ${dueno.dni}`}
                    </option>
                  ))}
                </select>
                {fieldErrors.duenoId && <div className="campo-error">{fieldErrors.duenoId}</div>}
              </div>

              <div className="campo-grupo">
                <label className="campo-etiqueta">Relación</label>
                <input
                  type="text"
                  className={`campo-entrada ${fieldErrors.relacion ? 'campo-entrada--error' : ''}`}
                  value={relacion}
                  onChange={(e) => { setRelacion(e.target.value); setFieldErrors((p) => { const n = { ...p }; delete n.relacion; return n; }); }}
                  required
                />
                {fieldErrors.relacion && <div className="campo-error">{fieldErrors.relacion}</div>}
              </div>

              <div className="dialogo-pie" style={{ padding: 'var(--espaciado-md) 0 0', borderTop: 'none' }}>
                <button type="button" className="boton boton--neutro" onClick={onClose}>Cancelar</button>
                <button type="submit" className="boton boton--primario">
                  Cambiar dueño principal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
