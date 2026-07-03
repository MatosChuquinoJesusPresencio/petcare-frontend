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
      const t = setTimeout(() => setFecha(cita.dateTime.substring(0, 10)));
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
    <>
      <div className="dialogo-fondo" onClick={onClose}></div>
      <div className="dialogo-contenedor" tabIndex={-1}>
        <div className="dialogo-ventana">
          <div className="dialogo-encabezado">
            <h5 className="dialogo-titulo">
              <i className="bi bi-clock-history me-1"></i>
              Reprogramar Cita
            </h5>
            <button type="button" className="dialogo-cerrar" onClick={onClose}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          <div className="dialogo-cuerpo">
            <form id="formReprogramar" onSubmit={handleSubmit}>
              <div className="campo-grupo">
                <label className="campo-etiqueta">Nueva Fecha *</label>
                <input
                  type="date"
                  className={`campo-entrada ${fieldErrors.fecha ? 'campo-entrada--error' : ''}`}
                  value={fecha}
                  onChange={(e) => { setFecha(e.target.value); setFieldErrors((p) => { const n = { ...p }; delete n.fecha; return n; }); }}
                  required
                />
                {fieldErrors.fecha && <div className="campo-error">{fieldErrors.fecha}</div>}
              </div>
              <div className="campo-grupo">
                <label className="campo-etiqueta">Horario disponible *</label>
                  <HorariosDisponibles
                  vetId={cita.veterinarianId}
                  serviceId={cita.serviceId}
                  fecha={fecha}
                  value={horaSeleccionada}
                  onChange={(v) => { setHoraSeleccionada(v); setFieldErrors((p) => { const n = { ...p }; delete n.horaSeleccionada; return n; }); }}
                />
                {fieldErrors.horaSeleccionada && <div className="campo-error">{fieldErrors.horaSeleccionada}</div>}
              </div>
              {error && <div className="dialogo-error">{error}</div>}
              <div className="dialogo-pie" style={{ padding: 'var(--espaciado-md) 0 0', borderTop: 'none' }}>
                <button type="button" className="boton boton--neutro" onClick={onClose}>Cancelar</button>
                <button type="submit" form="formReprogramar" className="boton boton--primario" disabled={!horaSeleccionada}>Reprogramar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
