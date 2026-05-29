import { useEffect, useState } from "react";

import type { Dueno } from "../../types";
import { getDuenos, vincularDueno, cambiarDuenoPrincipal } from "../../services";
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
  const [esPrincipal, setEsPrincipal] = useState(false);
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
      if (esPrincipal) {
        await cambiarDuenoPrincipal(mascotaId, duenoId, relacion);
      } else {
        await vincularDueno(mascotaId, duenoId, relacion);
      }
      await onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      setToast({ message: "No se pudo vincular el dueño.", type: "error" });
    }
  };

  if (!show) return null;

  return (
    <div className="modal d-block modal-bg">
      <NotificationToast toast={toast} onClose={() => setToast(null)} />
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Vincular Dueño</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Dueño</label>
                <select
                  className={`form-select ${fieldErrors.duenoId ? 'is-invalid' : ''}`}
                  value={duenoId}
                  onChange={(e) => { setDuenoId(Number(e.target.value)); setFieldErrors((p) => { const n = { ...p }; delete n.duenoId; return n; }); }}
                  required
                >
                  <option value="">Seleccione dueño</option>
                  {duenos.map((dueno) => (
                    <option key={dueno.id} value={dueno.id}>
                      {dueno.nombre} {dueno.apellido}
                    </option>
                  ))}
                </select>
                {fieldErrors.duenoId && <div className="invalid-feedback">{fieldErrors.duenoId}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Relación</label>
                <input
                  type="text"
                  className={`form-control ${fieldErrors.relacion ? 'is-invalid' : ''}`}
                  value={relacion}
                  onChange={(e) => { setRelacion(e.target.value); setFieldErrors((p) => { const n = { ...p }; delete n.relacion; return n; }); }}
                  required
                />
                {fieldErrors.relacion && <div className="invalid-feedback">{fieldErrors.relacion}</div>}
              </div>

              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="chkPrincipal"
                  checked={esPrincipal}
                  onChange={(e) => setEsPrincipal(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="chkPrincipal">
                  Establecer como dueño principal
                </label>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                {esPrincipal ? "Cambiar dueño principal" : "Vincular"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
