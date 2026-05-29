import type { CitaResponse } from "../../types/citaType";

interface Props {
  citas: CitaResponse[];
  onEstadoChange: (id: number, nuevoEstado: string) => void;
  onReprogramar: (cita: CitaResponse) => void;
  onCancelar: (id: number) => void;
}

function getStatusBadge(estado: string) {
  switch (estado) {
    case "PROGRAMADA": return "bg-primary";
    case "CONFIRMADA": return "bg-success";
    case "ATENDIDA": return "bg-info";
    case "NO_ASISTIDA": return "bg-warning text-dark";
    case "CANCELADA": return "bg-danger";
    default: return "bg-secondary";
  }
}

const estadosDisponibles = ["CONFIRMADA", "ATENDIDA", "NO_ASISTIDA"];

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
                <span className={`badge ${getStatusBadge(cita.estado)}`}>
                  {cita.estado}
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
                    {estadosDisponibles.map((est) => (
                      <li key={est}>
                        <button
                          className="dropdown-item"
                          onClick={() => onEstadoChange(cita.id, est)}
                          disabled={cita.estado === est}
                        >
                          {est === "CONFIRMADA" ? "Confirmar" : est === "ATENDIDA" ? "Atendida" : "No Asistió"}
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
