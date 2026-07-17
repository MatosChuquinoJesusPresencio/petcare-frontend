import { useState } from "react";
import AlertasMedicasPanel from "./AlertasMedicasPanel";
import type { MascotaAlertaResponse } from "../../types";

type Props = {
  mascotaId: number;
  mascotaNombre: string;
  datos?: MascotaAlertaResponse | null;
};

const AlertasMedicasBadge = ({ mascotaId, mascotaNombre, datos }: Props) => {
  const [showPanel, setShowPanel] = useState(false);

  const tieneAlertas = datos?.tieneAlertas ?? false;
  if (!tieneAlertas) return null;

  return (
    <>
      <button
        className="btn btn-sm btn-outline-danger"
        style={{ fontSize: "var(--tamano-xs)", padding: "2px 8px" }}
        onClick={() => setShowPanel(true)}
        title={`Alertas médicas de ${mascotaNombre}`}
      >
        <i className="bi bi-exclamation-triangle-fill me-1"></i>
        Alertas
      </button>

      {showPanel && (
        <AlertasMedicasPanel
          mascotaId={mascotaId}
          mascotaNombre={mascotaNombre}
          datos={datos}
          onClose={() => setShowPanel(false)}
        />
      )}
    </>
  );
};

export default AlertasMedicasBadge;
