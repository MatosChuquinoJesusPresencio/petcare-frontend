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
  onHistorial?: (id: number) => void;
  showActions?: boolean;
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
  const nombre = dueno.usuario ? `${dueno.usuario.names} ${dueno.usuario.lastNames}` : dueno.dni;
  return <span>{nombre}</span>;
}

export default function MascotaTable({
  mascotas,
  onEdit,
  onDelete,
  onToggle,
  onVincular,
  onHistorial,
  showActions = true,
}: Props) {
  const cols = ["#", "Nombre", "Especie", "Raza", "Sexo", "Dueño", "Estado", ...(showActions ? ["Acciones"] : [])];
  return (
    <DataTable
      columns={cols}
      emptyMessage="No hay mascotas registradas."
      colSpan={cols.length}
    >
      {mascotas.map((mascota, index) => (
        <tr key={mascota.id}>
          <td><span className="numero-fila">{index + 1}</span></td>
          <td>{mascota.name}</td>
          <td>{mascota.especie}</td>
          <td>{mascota.breed}</td>
          <td>{mascota.gender}</td>
          <td><DueñoInfo mascotaId={mascota.id} /></td>
          <td>
            <span className={`etiqueta ${mascota.active ? 'etiqueta--activo' : 'etiqueta--inactivo'}`}>
              {mascota.active ? 'Activo' : 'Inactivo'}
            </span>
          </td>
          {showActions && (
            <td>
              <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                <ActionButtons
                  activo={mascota.active}
                  onEdit={() => onEdit(mascota.id)}
                  onToggle={() => onToggle(mascota.id)}
                  onDelete={() => onDelete(mascota.id)}
                  onVincular={() => onVincular(mascota.id)}
                />
                {onHistorial && (
                  <button className="boton boton--informacion boton--icono" title="Ver historial de transferencias" onClick={(e) => { e.stopPropagation(); onHistorial(mascota.id); }}>
                    <i className="bi bi-clock-history"></i>
                  </button>
                )}
              </div>
            </td>
          )}
        </tr>
      ))}
    </DataTable>
  );
}
