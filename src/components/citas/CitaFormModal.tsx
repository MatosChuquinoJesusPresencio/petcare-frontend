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

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

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
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Agendar Nueva Cita</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form id="formCita" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Mascota *</label>
                <select className="form-select" value={petId} onChange={(e) => setPetId(e.target.value)} required>
                  <option value="">Seleccione mascota...</option>
                  {mascotas.map((m) => (
                    <option key={m.id} value={m.id}>{m.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Veterinario *</label>
                <select className="form-select" value={veterinarianId} onChange={(e) => setVeterinarianId(e.target.value)} required>
                  <option value="">Seleccione veterinario...</option>
                  {veterinarios.map((v) => (
                    <option key={v.id} value={v.id}>{v.nombre} {v.apellido}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Servicio *</label>
                <select className="form-select" value={serviceId} onChange={(e) => setServiceId(e.target.value)} required>
                  <option value="">Seleccione servicio...</option>
                  {servicios.map((s) => (
                    <option key={s.id} value={s.id}>{s.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Fecha *</label>
                <input type="date" className="form-control" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Horario disponible *</label>
                <HorariosDisponibles
                  vetId={veterinarianId ? Number(veterinarianId) : null}
                  serviceId={serviceId ? Number(serviceId) : null}
                  fecha={fecha}
                  value={horaSeleccionada}
                  onChange={setHoraSeleccionada}
                />
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
