import { useEffect, useState } from "react";

import type { MascotaResponse } from "../../types/mascotaType";
import type { Dueno } from "../../types/duenoType";
import { obtenerDuenoPrincipal } from "../../services/mascotaService";

interface Props {
  mascotas: MascotaResponse[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onVincular: (id: number) => void;
}

function DueñoInfo({ mascotaId }: { mascotaId: number }) {
  const [dueno, setDueno] = useState<Dueno | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    obtenerDuenoPrincipal(mascotaId).then((d) => {
      if (!ignore) {
        setDueno(d);
        setLoading(false);
      }
    });
    return () => { ignore = true; };
  }, [mascotaId]);

  if (loading) return <span className="text-muted small">Cargando...</span>;
  if (!dueno) return <span className="text-muted fst-italic">Sin dueño</span>;
  return <span>{dueno.nombre} {dueno.apellido}</span>;
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

              <td><DueñoInfo mascotaId={mascota.id} /></td>

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
