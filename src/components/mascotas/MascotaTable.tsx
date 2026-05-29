import type { MascotaResponse } from "../../types/mascotaType";

interface Props {
  mascotas: MascotaResponse[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onVincular: (id: number) => void;
}

export default function MascotaTable({
  mascotas,
  onEdit,
  onDelete,
  onToggle,
  onVincular,
}: Props) {
  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Especie</th>
            <th>Raza</th>
            <th>Sexo</th>
            <th>Dueño</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {mascotas.map((mascota, index) => (
            <tr key={mascota.id}>
              <td>{index + 1}</td>

              <td>{mascota.nombre}</td>

              <td>{mascota.especie}</td>

              <td>{mascota.raza}</td>

              <td>{mascota.sexo}</td>

              <td>
                {mascota.duenoPrincipal ? (
                  <span>{mascota.duenoPrincipal}</span>
                ) : (
                  <span className="text-muted fst-italic">Sin dueño</span>
                )}
              </td>

              <td>
                {mascota.activo ? (
                  <span className="badge bg-success">Activo</span>
                ) : (
                  <span className="badge bg-danger">Inactivo</span>
                )}
              </td>

              <td>
                <div className="d-flex justify-content-evenly">
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => onEdit(mascota.id)}
                  >
                    <i className="bi bi-pencil-fill"></i>
                  </button>
                  <button
                    className={`btn btn-sm ${mascota.activo ? "btn-secondary" : "btn-success"}`}
                    onClick={() => onToggle(mascota.id)}
                  >
                    <i className={`bi ${mascota.activo ? "bi-pause-fill" : "bi-play-fill"}`}></i>
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(mascota.id)}
                  >
                    <i className="bi bi-trash3-fill"></i>
                  </button>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => onVincular(mascota.id)}
                  >
                    <i className="bi bi-person-plus-fill"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
