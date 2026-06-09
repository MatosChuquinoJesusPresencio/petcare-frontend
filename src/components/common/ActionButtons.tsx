import type { MouseEvent } from "react";

interface ActionButtonsProps {
  activo: boolean;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
  onVincular?: () => void;
  size?: "sm" | "md";
}

function stop(e: MouseEvent) {
  e.stopPropagation();
}

export default function ActionButtons({
  activo,
  onEdit,
  onToggle,
  onDelete,
  onVincular,
}: ActionButtonsProps) {
  return (
    <div className="acciones-tabla">
      <button className="boton boton--advertencia boton--icono" title="Editar" onClick={(e) => { stop(e); onEdit(); }}>
        <i className="bi bi-pencil-fill"></i>
      </button>
      <button
        className={`boton boton--icono ${activo ? 'boton--neutro' : 'boton--exito'}`}
        title={activo ? 'Desactivar' : 'Activar'}
        onClick={(e) => { stop(e); onToggle(); }}
      >
        <i className={`bi ${activo ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
      </button>
      <button className="boton boton--peligro boton--icono" title="Eliminar" onClick={(e) => { stop(e); onDelete(); }}>
        <i className="bi bi-trash3-fill"></i>
      </button>
      {onVincular !== undefined && (
        <button className="boton boton--informacion boton--icono" title="Vincular dueño" onClick={(e) => { stop(e); onVincular(); }}>
          <i className="bi bi-person-plus-fill"></i>
        </button>
      )}
    </div>
  );
}
