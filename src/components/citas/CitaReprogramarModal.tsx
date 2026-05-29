import { useEffect, useState } from "react";

import HorariosDisponibles from "./HorariosDisponibles";
import { getErrorMessage } from "../../utils/errorHandler";

import type { CitaResponse } from "../../types";
import { reprogramarCita } from "../../services";

interface Props {
  show: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  cita: CitaResponse | null;
}

export default function CitaReprogramarModal({ show, onClose, onSuccess, cita }: Props) {
  const [fecha, setFecha] = useState("");
  const [horaSeleccionada, setHoraSeleccionada] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (cita) {
      const t = setTimeout(() => setFecha(cita.fechaHora.substring(0, 10)));
      return () => clearTimeout(t);
    }
  }, [cita]);

  if (!show || !cita) return null;

  const validate = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!fecha) {
      errors.fecha = "La fecha es obligatoria.";
    } else {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (new Date(fecha) < hoy) {
        errors.fecha = "La fecha no puede ser pasada.";
      }
    }
    if (!horaSeleccionada) {
      errors.horaSeleccionada = "Selecciona un horario disponible.";
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    const dateTime = `${fecha}T${horaSeleccionada}`;

    try {
      await reprogramarCita(cita.id, dateTime);
      onClose();
      await onSuccess();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="modal fade show d-block modal-bg" tabIndex={-1}>
      <div className="modal-dialog modal-force-dark-text">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Reprogramar Cita</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form id="formReprogramar" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nueva Fecha *</label>
                <input type="date" className={`form-control ${fieldErrors.fecha ? 'is-invalid' : ''}`} value={fecha} onChange={(e) => { setFecha(e.target.value); setFieldErrors((p) => { const n = { ...p }; delete n.fecha; return n; }); }} required />
                {fieldErrors.fecha && <div className="invalid-feedback">{fieldErrors.fecha}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Horario disponible *</label>
                <HorariosDisponibles
                  vetId={cita.veterinario.id}
                  serviceId={cita.servicio.id}
                  fecha={fecha}
                  value={horaSeleccionada}
                  onChange={(v) => { setHoraSeleccionada(v); setFieldErrors((p) => { const n = { ...p }; delete n.horaSeleccionada; return n; }); }}
                />
                {fieldErrors.horaSeleccionada && <div className="invalid-feedback">{fieldErrors.horaSeleccionada}</div>}
              </div>
              {error && <div className="alert alert-danger py-2">{error}</div>}
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" form="formReprogramar" className="btn btn-primary" disabled={!horaSeleccionada}>Reprogramar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
