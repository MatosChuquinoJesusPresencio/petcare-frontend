import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { ESTADOS_CITA, ESTADO_LABEL } from "../../constants";
import type { CitaResponse } from "../../types";
import DataTable from "../common/DataTable";

interface Props {
  citas: CitaResponse[];
  onEstadoChange: (id: number, nuevoEstado: string) => void;
  onReprogramar: (cita: CitaResponse) => void;
  onCancelar: (id: number) => void;
}

interface DropdownAbierto {
  citaId: number;
  top: number;
  left: number;
}

function mapearBadge(estado: string): string {
  const mapa: Record<string, string> = {
    AGENDADA: 'etiqueta--agendada',
    CONFIRMADA: 'etiqueta--confirmada',
    REPROGRAMADA: 'etiqueta--reprogramada',
    CANCELADA: 'etiqueta--cancelada',
    ATENDIDA: 'etiqueta--atendida',
    NO_ASISTIO: 'etiqueta--no_asistio',
  };
  return mapa[estado] || 'bg-secondary';
}

export default function CitaTable({ citas, onEstadoChange, onReprogramar, onCancelar }: Props) {
  const [dropdown, setDropdown] = useState<DropdownAbierto | null>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const abrirDropdown = useCallback((e: React.MouseEvent, citaId: number) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDropdown((prev) =>
      prev?.citaId === citaId ? null : { citaId, top: rect.bottom + 4, left: rect.left }
    );
  }, []);

  const seleccionarEstado = useCallback(
    (citaId: number, estado: string) => {
      onEstadoChange(citaId, estado);
      setDropdown(null);
    },
    [onEstadoChange]
  );

  useEffect(() => {
    if (!dropdown) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdown]);

  return (
    <>
      <DataTable
        columns={["#", "Fecha y Hora", "Mascota", "Veterinario", "Servicio", "Estado", "Acciones"]}
        emptyMessage="No hay citas registradas."
        colSpan={7}
      >
        {citas.map((cita, index) => (
          <tr key={cita.id}>
            <td><span className="numero-fila">{index + 1}</span></td>
            <td>{new Date(cita.fechaHora).toLocaleString()}</td>
            <td>{cita.mascota?.nombre}</td>
            <td>{cita.veterinario?.nombre} {cita.veterinario?.apellido}</td>
            <td>{cita.servicio?.nombre}</td>
            <td>
              <span className={`etiqueta ${mapearBadge(cita.estado)}`}>
                {ESTADO_LABEL[cita.estado as keyof typeof ESTADO_LABEL] || cita.estado}
              </span>
            </td>
            <td>
              <div className="acciones-tabla">
                <button
                  className="boton boton--advertencia boton--icono"
                  type="button"
                  onClick={(e) => abrirDropdown(e, cita.id)}
                  title="Cambiar estado"
                >
                  <i className="bi bi-gear-fill"></i>
                </button>
                <button className="boton boton--informacion boton--icono" onClick={() => onReprogramar(cita)} title="Reprogramar">
                  <i className="bi bi-clock-history"></i>
                </button>
                <button className="boton boton--peligro boton--icono" onClick={() => onCancelar(cita.id)} title="Cancelar">
                  <i className="bi bi-x-circle"></i>
                </button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      {dropdown &&
        createPortal(
          <ul
            ref={menuRef}
            className="dropdown-menu dropdown-menu--custom"
            style={{ position: "fixed", top: dropdown.top, left: dropdown.left }}
          >
            {ESTADOS_CITA.filter((est) => est !== citas.find((c) => c.id === dropdown.citaId)?.estado).map((est) => (
              <li key={est}>
                <button className="dropdown-item" onClick={() => seleccionarEstado(dropdown.citaId, est)}>
                  {ESTADO_LABEL[est]}
                </button>
              </li>
            ))}
          </ul>,
          document.body
        )}
    </>
  );
}
