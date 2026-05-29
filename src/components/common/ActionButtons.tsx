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
  size = "md",
}: ActionButtonsProps) {
  const s = size === "sm" ? "btn-sm" : "";

  return (
    <div className="d-flex justify-content-evenly">
      <button
        className={`btn btn-warning ${s}`}
        onClick={(e) => { stop(e); onEdit(); }}
      >
        <i className="bi bi-pencil-fill"></i>
      </button>
      <button
        className={`btn ${s} ${activo ? "btn-secondary" : "btn-success"}`}
        onClick={(e) => { stop(e); onToggle(); }}
      >
        <i className={`bi ${activo ? "bi-pause-fill" : "bi-play-fill"}`}></i>
      </button>
      <button
        className={`btn btn-danger ${s}`}
        onClick={(e) => { stop(e); onDelete(); }}
      >
        <i className="bi bi-trash3-fill"></i>
      </button>
      {onVincular !== undefined && (
        <button
          className={`btn btn-info ${s}`}
          onClick={(e) => { stop(e); onVincular(); }}
        >
          <i className="bi bi-person-plus-fill"></i>
        </button>
      )}
    </div>
  );
}
