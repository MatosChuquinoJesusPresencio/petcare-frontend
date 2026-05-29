import { ESTADOS_CITA, ESTADO_BADGE, ESTADO_LABEL } from "../../constants";
import type { CitaResponse } from "../../types";
import DataTable from "../common/DataTable";

interface Props {
  citas: CitaResponse[];
  onEstadoChange: (id: number, nuevoEstado: string) => void;
  onReprogramar: (cita: CitaResponse) => void;
  onCancelar: (id: number) => void;
}

export default function CitaTable({ citas, onEstadoChange, onReprogramar, onCancelar }: Props) {
  return (
    <DataTable
      columns={["#", "Fecha y Hora", "Mascota", "Veterinario", "Servicio", "Estado", "Acciones"]}
      emptyMessage="No hay citas registradas."
      colSpan={7}
    >
      {citas.map((cita, index) => (
        <tr key={cita.id}>
          <td>{index + 1}</td>
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
            <div className="d-flex justify-content-evenly">
              <div className="dropdown d-inline-block">
                <button
                  className="btn btn-sm btn-warning dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-gear-fill"></i>
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
                className="btn btn-sm btn-secondary"
                onClick={() => onReprogramar(cita)}
                title="Reprogramar"
              >
                <i className="bi bi-clock-history"></i>
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => onCancelar(cita.id)}
                title="Cancelar"
              >
                <i className="bi bi-x-circle"></i>
              </button>
            </div>
          </td>
        </tr>
      ))}
    </DataTable>
  );
}
