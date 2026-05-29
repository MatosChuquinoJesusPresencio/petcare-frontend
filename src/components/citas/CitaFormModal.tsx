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
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (new Date(fecha) < hoy) {
        errors.fecha = "La fecha no puede ser pasada.";
      }
    }
    if (!horaSeleccionada) errors.horaSeleccionada = "Selecciona un horario disponible.";
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
    <div className="modal fade show d-block modal-bg" tabIndex={-1}>
      <div className="modal-dialog modal-force-dark-text">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Agendar Nueva Cita</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form id="formCita" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Mascota *</label>
                <select className={`form-select ${fieldErrors.petId ? 'is-invalid' : ''}`} value={petId} onChange={(e) => { setPetId(e.target.value); clearFieldError('petId'); }} required>
                  <option value="">Seleccione mascota...</option>
                  {mascotas.map((m) => (
                    <option key={m.id} value={m.id}>{m.nombre}</option>
                  ))}
                </select>
                {fieldErrors.petId && <div className="invalid-feedback">{fieldErrors.petId}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Veterinario *</label>
                <select className={`form-select ${fieldErrors.veterinarianId ? 'is-invalid' : ''}`} value={veterinarianId} onChange={(e) => { setVeterinarianId(e.target.value); clearFieldError('veterinarianId'); }} required>
                  <option value="">Seleccione veterinario...</option>
                  {veterinarios.map((v) => (
                    <option key={v.id} value={v.id}>{v.nombre} {v.apellido}</option>
                  ))}
                </select>
                {fieldErrors.veterinarianId && <div className="invalid-feedback">{fieldErrors.veterinarianId}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Servicio *</label>
                <select className={`form-select ${fieldErrors.serviceId ? 'is-invalid' : ''}`} value={serviceId} onChange={(e) => { setServiceId(e.target.value); clearFieldError('serviceId'); }} required>
                  <option value="">Seleccione servicio...</option>
                  {servicios.map((s) => (
                    <option key={s.id} value={s.id}>{s.nombre}</option>
                  ))}
                </select>
                {fieldErrors.serviceId && <div className="invalid-feedback">{fieldErrors.serviceId}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Fecha *</label>
                <input type="date" className={`form-control ${fieldErrors.fecha ? 'is-invalid' : ''}`} value={fecha} onChange={(e) => { setFecha(e.target.value); clearFieldError('fecha'); }} required />
                {fieldErrors.fecha && <div className="invalid-feedback">{fieldErrors.fecha}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Horario disponible *</label>
                <HorariosDisponibles
                  vetId={veterinarianId ? Number(veterinarianId) : null}
                  serviceId={serviceId ? Number(serviceId) : null}
                  fecha={fecha}
                  value={horaSeleccionada}
                  onChange={(v) => { setHoraSeleccionada(v); clearFieldError('horaSeleccionada'); }}
                />
                {fieldErrors.horaSeleccionada && <div className="invalid-feedback">{fieldErrors.horaSeleccionada}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Notas</label>
                <textarea className="form-control" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
              </div>
              {error && <div className="alert alert-danger py-2">{error}</div>}
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
            <button type="submit" form="formCita" className="btn btn-primary" disabled={!horaSeleccionada}>Guardar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
