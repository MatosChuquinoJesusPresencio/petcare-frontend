import { useState } from "react";

import HorariosDisponibles from "./HorariosDisponibles";
import { getErrorMessage } from "../../utils/errorHandler";

import type { MascotaResponse, ServicioResponse, VeterinarioResponse } from "../../types";
import { agendarCita } from "../../services";

interface Props {
  show: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  mascotas: MascotaResponse[];
  servicios: ServicioResponse[];
  veterinarios: VeterinarioResponse[];
}

export default function CitaFormModal({ show, onClose, onSuccess, mascotas, servicios, veterinarios }: Props) {
  const [petId, setPetId] = useState("");
  const [veterinarianId, setVeterinarianId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [fecha, setFecha] = useState("");
  const [horaSeleccionada, setHoraSeleccionada] = useState("");
  const [notes, setNotes] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (!show) return null;

  const validate = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!petId) errors.petId = "Selecciona una mascota.";
    if (!veterinarianId) errors.veterinarianId = "Selecciona un veterinario.";
    if (!serviceId) errors.serviceId = "Selecciona un servicio.";
    if (!fecha) {
      errors.fecha = "La fecha es obligatoria.";
    } else {
      const [year, month, day] = fecha.split("-").map(Number);
      const fechaLocal = new Date(year, month - 1, day);
      fechaLocal.setHours(0, 0, 0, 0);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (fechaLocal < hoy) {
        errors.fecha = "La fecha no puede ser pasada.";
      } else if (fechaLocal.getTime() === hoy.getTime() && horaSeleccionada) {
        const [h, m] = horaSeleccionada.split(":").map(Number);
        const ahora = new Date();
        const minsActual = ahora.getHours() * 60 + ahora.getMinutes();
        const minsSel = h * 60 + m;
        if (minsSel <= minsActual) {
          errors.horaSeleccionada = "La hora debe ser mayor a la actual.";
        }
      }
    }
    if (!horaSeleccionada && !errors.horaSeleccionada) errors.horaSeleccionada = "Selecciona un horario disponible.";
    return errors;
  };

  const clearFieldError = (field: string) => {
    setFieldErrors((p) => {
      if (!p[field]) return p;
      const n = { ...p };
      delete n[field];
      return n;
    });
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
      await agendarCita({
        petId: Number(petId),
        veterinarianId: Number(veterinarianId),
        serviceId: Number(serviceId),
        dateTime,
        notes: notes || undefined,
      });
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
              <i className="bi bi-calendar-plus me-1"></i>
              Agendar Nueva Cita
            </h5>
            <button type="button" className="dialogo-cerrar" onClick={onClose}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          <div className="dialogo-cuerpo">
            <form id="formCita" onSubmit={handleSubmit}>
              <div className="campo-grupo">
                <label className="campo-etiqueta">Mascota *</label>
                <select className={`campo-entrada ${fieldErrors.petId ? 'campo-entrada--error' : ''}`} value={petId} onChange={(e) => { setPetId(e.target.value); clearFieldError('petId'); }} required>
                  <option value="">Seleccione mascota...</option>
                  {mascotas.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
                {fieldErrors.petId && <div className="campo-error">{fieldErrors.petId}</div>}
              </div>
              <div className="campo-grupo">
                <label className="campo-etiqueta">Veterinario *</label>
                <select className={`campo-entrada ${fieldErrors.veterinarianId ? 'campo-entrada--error' : ''}`} value={veterinarianId} onChange={(e) => { setVeterinarianId(e.target.value); clearFieldError('veterinarianId'); }} required>
                  <option value="">Seleccione veterinario...</option>
                  {veterinarios.map((v) => (
                    <option key={v.id} value={v.id}>{v.names} {v.lastNames}</option>
                  ))}
                </select>
                {fieldErrors.veterinarianId && <div className="campo-error">{fieldErrors.veterinarianId}</div>}
              </div>
              <div className="campo-grupo">
                <label className="campo-etiqueta">Servicio *</label>
                <select className={`campo-entrada ${fieldErrors.serviceId ? 'campo-entrada--error' : ''}`} value={serviceId} onChange={(e) => { setServiceId(e.target.value); clearFieldError('serviceId'); }} required>
                  <option value="">Seleccione servicio...</option>
                  {servicios.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                {fieldErrors.serviceId && <div className="campo-error">{fieldErrors.serviceId}</div>}
              </div>
              <div className="campo-grupo">
                <label className="campo-etiqueta">Fecha *</label>
                <input type="date" className={`campo-entrada ${fieldErrors.fecha ? 'campo-entrada--error' : ''}`} value={fecha} onChange={(e) => { setFecha(e.target.value); clearFieldError('fecha'); }} required />
                {fieldErrors.fecha && <div className="campo-error">{fieldErrors.fecha}</div>}
              </div>
              <div className="campo-grupo">
                <label className="campo-etiqueta">Horario disponible *</label>
                <HorariosDisponibles
                  vetId={veterinarianId ? Number(veterinarianId) : null}
                  serviceId={serviceId ? Number(serviceId) : null}
                  fecha={fecha}
                  value={horaSeleccionada}
                  onChange={(v) => { setHoraSeleccionada(v); clearFieldError('horaSeleccionada'); }}
                />
                {fieldErrors.horaSeleccionada && <div className="campo-error">{fieldErrors.horaSeleccionada}</div>}
              </div>
              <div className="campo-grupo">
                <label className="campo-etiqueta">Notas</label>
                <textarea className="campo-entrada" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
              </div>
              {error && <div className="dialogo-error">{error}</div>}
              <div className="dialogo-pie" style={{ padding: 'var(--espaciado-md) 0 0', borderTop: 'none' }}>
                <button type="button" className="boton boton--neutro" onClick={onClose}>Cerrar</button>
                <button type="submit" form="formCita" className="boton boton--primario" disabled={!horaSeleccionada}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
