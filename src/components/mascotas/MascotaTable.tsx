import type { Mascota } from "../../types/mascota";

interface Props {
  mascotas: Mascota[];

  onEdit: (id: number) => void;

  onDelete: (id: number) => void;

  onVincular: (id: number) => void;
}

export default function MascotaTable({
  mascotas,
  onEdit,
  onDelete,
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
                {mascota.activo ? (
                  <span className="badge bg-success">Activo</span>
                ) : (
                  <span className="badge bg-danger">Inactivo</span>
                )}
              </td>

              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => onEdit(mascota.id)}
                >
                  ✏️
                </button>

                <button
                  className="btn btn-danger btn-sm me-2"
                  onClick={() => onDelete(mascota.id)}
                >
                  🗑️
                </button>

                <button
                  className="btn btn-info btn-sm"
                  onClick={() => onVincular(mascota.id)}
                >
                  👤
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
