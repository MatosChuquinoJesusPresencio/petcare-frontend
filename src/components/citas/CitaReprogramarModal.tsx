import { useEffect, useState } from "react";
import type { CitaResponse } from "../../types/citaType";
import { reprogramarCita, obtenerDisponibilidad } from "../../services/citaService";

interface Props {
  show: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  cita: CitaResponse | null;
}

export default function CitaReprogramarModal({ show, onClose, onSuccess, cita }: Props) {
  const [fecha, setFecha] = useState("");
  const [horaSeleccionada, setHoraSeleccionada] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cita) {
      setFecha(cita.fechaHora.substring(0, 10));
    }
  }, [cita]);

  useEffect(() => {
    setHoraSeleccionada("");
    setSlots([]);
    setError(null);

    if (!cita || !fecha) return;

    const timer = setTimeout(async () => {
      setLoadingSlots(true);
      try {
        const data = await obtenerDisponibilidad(cita.veterinario.id, fecha, cita.servicio.id);
        setSlots(data.horariosDisponibles);
      } catch {
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [cita, fecha]);

  if (!show || !cita) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const dateTime = `${fecha}T${horaSeleccionada}`;

    try {
      await reprogramarCita(cita.id, dateTime);
      onClose();
      await onSuccess();
    } catch (err: unknown) {
      const msg = (err as any)?.response?.data?.mensaje || "Error al reprogramar la cita";
      setError(msg);
    }
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Reprogramar Cita</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form id="formReprogramar" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nueva Fecha *</label>
                <input type="date" className="form-control" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Horario disponible *</label>
                {!fecha ? (
                  <p className="text-muted small mb-0">Seleccione una fecha.</p>
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
                <input type="hidden" value={horaSeleccionada} required={!!fecha} />
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
