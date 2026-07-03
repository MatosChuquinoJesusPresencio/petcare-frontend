import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { ESTADOS_CITA, ESTADO_LABEL } from "../../constants";
import type { CitaResponse, MascotaResponse, ServicioResponse, VeterinarioResponse } from "../../types";
import DataTable from "../common/DataTable";

interface Props {
  citas: CitaResponse[];
  mascotaMap: Map<number, MascotaResponse>;
  veterinarioMap: Map<number, VeterinarioResponse>;
  servicioMap: Map<number, ServicioResponse>;
  onEstadoChange: (id: number, nuevoEstado: string) => void;
  onReprogramar: (cita: CitaResponse) => void;
  onCancelar: (id: number) => void;
  showActions?: boolean;
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

export default function CitaTable({ citas, mascotaMap, veterinarioMap, servicioMap, onEstadoChange, onReprogramar, onCancelar, showActions = true }: Props) {
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
        columns={["#", "Fecha y Hora", "Mascota", "Veterinario", "Servicio", "Estado", ...(showActions ? ["Acciones"] : [])]}
        emptyMessage="No hay citas registradas."
        colSpan={showActions ? 7 : 6}
      >
        {citas.map((cita, index) => {
          const mascota = mascotaMap.get(cita.petId);
          const veterinario = veterinarioMap.get(cita.veterinarianId);
          const servicio = servicioMap.get(cita.serviceId);
          return (
            <tr key={cita.id}>
              <td><span className="numero-fila">{index + 1}</span></td>
              <td>{new Date(cita.dateTime).toLocaleString()}</td>
              <td>{mascota?.name ?? `ID: ${cita.petId}`}</td>
              <td>{veterinario ? `${veterinario.names} ${veterinario.lastNames}` : `ID: ${cita.veterinarianId}`}</td>
              <td>{servicio?.name ?? `ID: ${cita.serviceId}`}</td>
              <td>
                <span className={`etiqueta ${mapearBadge(cita.status)}`}>
                  {ESTADO_LABEL[cita.status as keyof typeof ESTADO_LABEL] || cita.status}
                </span>
              </td>
              {showActions && (
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
              )}
            </tr>
          );
        })}
      </DataTable>

      {dropdown &&
        createPortal(
          <ul
            ref={menuRef}
            className="dropdown-menu dropdown-menu--custom"
            style={{ position: "fixed", top: dropdown.top, left: dropdown.left }}
          >
            {ESTADOS_CITA.filter((est) => est !== citas.find((c) => c.id === dropdown.citaId)?.status).map((est) => (
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
