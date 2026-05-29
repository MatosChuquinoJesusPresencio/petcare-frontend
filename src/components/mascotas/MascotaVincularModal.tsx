import { useEffect, useState } from "react";

import { vincularDueno } from "../../services/mascotaService";
import { obtenerDuenos } from "../../services/duenoService";

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
  const [duenos, setDuenos] = useState<any[]>([]);

  const [duenoId, setDuenoId] = useState(0);

  const [relacion, setRelacion] = useState("Tutor");

  useEffect(() => {
    if (show) {
      cargarDuenos();
    }
  }, [show]);

  const cargarDuenos = async () => {
    try {
      const data = await obtenerDuenos();

      setDuenos(data.content);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mascotaId) return;

    try {
      await vincularDueno(mascotaId, duenoId, relacion);

      await onSuccess();

      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal d-block"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
    >
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
                  className="form-select"
                  value={duenoId}
                  onChange={(e) => setDuenoId(Number(e.target.value))}
                  required
                >
                  <option value="">Seleccione dueño</option>

                  {duenos.map((dueno) => (
                    <option key={dueno.id} value={dueno.id}>
                      {dueno.nombre} {dueno.apellido}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Relación</label>

                <input
                  type="text"
                  className="form-control"
                  value={relacion}
                  onChange={(e) => setRelacion(e.target.value)}
                  required
                />
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
                Vincular
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
