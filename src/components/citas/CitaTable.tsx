import { ESTADOS_CITA, ESTADO_BADGE, ESTADO_LABEL } from "../../constants";
import type { CitaResponse } from "../../types";

interface Props {
  citas: CitaResponse[];
  onEstadoChange: (id: number, nuevoEstado: string) => void;
  onReprogramar: (cita: CitaResponse) => void;
  onCancelar: (id: number) => void;
}

export default function CitaTable({ citas, onEstadoChange, onReprogramar, onCancelar }: Props) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Fecha y Hora</th>
            <th>Mascota</th>
            <th>Veterinario</th>
            <th>Servicio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {citas.map((cita) => (
            <tr key={cita.id}>
              <td>{new Date(cita.fechaHora).toLocaleString()}</td>
              <td>{cita.mascota?.nombre}</td>
              <td>{cita.veterinario?.nombre} {cita.veterinario?.apellido}</td>
              <td>{cita.servicio?.nombre}</td>
              <td>
                <span className={`badge ${ESTADO_BADGE[cita.estado as keyof typeof ESTADO_BADGE] || "bg-secondary"}`}>
                  {ESTADO_LABEL[cita.estado as keyof typeof ESTADO_LABEL] || cita.estado}
                </span>
              </td>
              <td>
                <div className="dropdown d-inline-block me-2">
                  <button
                    className="btn btn-sm btn-outline-secondary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Estado
                  </button>
                  <ul className="dropdown-menu">
                    {ESTADOS_CITA.filter((est) => est !== cita.estado).map((est) => (
                      <li key={est}>
                        <button
                          className="dropdown-item"
                          onClick={() => onEstadoChange(cita.id, est)}
                          disabled={cita.estado === est}
                        >
                          {ESTADO_LABEL[est]}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => onReprogramar(cita)}
                  title="Reprogramar"
                >
                  <i className="bi bi-clock-history"></i>
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onCancelar(cita.id)}
                  title="Cancelar"
                >
                  <i className="bi bi-x-circle"></i>
                </button>
              </td>
            </tr>
          ))}
          {citas.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-4 text-muted">No hay citas registradas.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
