import { useEffect, useState } from "react";

import ActionButtons from "../common/ActionButtons";
import DataTable from "../common/DataTable";

import type { Dueno, MascotaResponse } from "../../types";
import { obtenerDuenoPrincipal } from "../../services";

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
    const t = setTimeout(() => setLoading(true));
    let ignore = false;
    obtenerDuenoPrincipal(mascotaId).then((d) => {
      if (!ignore) {
        setDueno(d);
        setLoading(false);
      }
    });
    return () => { clearTimeout(t); ignore = true; };
  }, [mascotaId]);

  if (loading) return <span style={{ color: 'var(--color-texto-claro)', fontSize: 'var(--tamano-sm)' }}>Cargando...</span>;
  if (!dueno) return <span style={{ color: 'var(--color-texto-claro)', fontStyle: 'italic' }}>Sin dueño</span>;
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
    <DataTable
      columns={["#", "Nombre", "Especie", "Raza", "Sexo", "Dueño", "Estado", "Acciones"]}
      emptyMessage="No hay mascotas registradas."
      colSpan={8}
    >
      {mascotas.map((mascota, index) => (
        <tr key={mascota.id}>
          <td><span className="numero-fila">{index + 1}</span></td>
          <td>{mascota.nombre}</td>
          <td>{mascota.especie}</td>
          <td>{mascota.raza}</td>
          <td>{mascota.sexo}</td>
          <td><DueñoInfo mascotaId={mascota.id} /></td>
          <td>
            <span className={`etiqueta ${mascota.activo ? 'etiqueta--activo' : 'etiqueta--inactivo'}`}>
              {mascota.activo ? 'Activo' : 'Inactivo'}
            </span>
          </td>
          <td>
            <ActionButtons
              activo={mascota.activo}
              onEdit={() => onEdit(mascota.id)}
              onToggle={() => onToggle(mascota.id)}
              onDelete={() => onDelete(mascota.id)}
              onVincular={() => onVincular(mascota.id)}
            />
          </td>
        </tr>
      ))}
    </DataTable>
  );
}
