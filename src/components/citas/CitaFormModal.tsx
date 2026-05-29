import { useEffect, useState } from "react";
import type { MascotaResponse } from "../../types/mascotaType";
import type { ServicioResponse } from "../../types/servicioType";
import type { VeterinarioResponse } from "../../types/citaType";
import { agendarCita, obtenerDisponibilidad } from "../../services/citaService";

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

  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setHoraSeleccionada("");
    setSlots([]);
    setError(null);

    if (!veterinarianId || !fecha || !serviceId) return;

    const timer = setTimeout(async () => {
      setLoadingSlots(true);
      try {
        const data = await obtenerDisponibilidad(Number(veterinarianId), fecha, Number(serviceId));
        setSlots(data.horariosDisponibles);
      } catch {
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [veterinarianId, fecha, serviceId]);

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
      const msg = (err as any)?.response?.data?.mensaje || "Error al agendar la cita";
      setError(msg);
    }
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex={-1}>
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
                {!veterinarianId || !fecha || !serviceId ? (
                  <p className="text-muted small mb-0">Seleccione veterinario, servicio y fecha para ver horarios disponibles.</p>
                ) : loadingSlots ? (
                  <p className="text-muted small mb-0">Cargando horarios...</p>
                ) : slots.length === 0 ? (
                  <p className="text-danger small mb-0">No hay horarios disponibles para esta fecha.</p>
                ) : (
                  <div className="d-flex flex-wrap gap-2">
                    {slots.map((h) => (
                      <button
                        key={h}
                        type="button"
                        className={`btn btn-sm ${horaSeleccionada === h ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setHoraSeleccionada(h)}
                      >
                        {h.substring(0, 5)}
                      </button>
                    ))}
                  </div>
                )}
                <input type="hidden" value={horaSeleccionada} required={!!veterinarianId && !!fecha && !!serviceId} />
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
