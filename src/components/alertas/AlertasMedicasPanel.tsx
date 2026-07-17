import type { MascotaAlertaResponse } from "../../types";

type Props = {
  mascotaId: number;
  mascotaNombre: string;
  datos?: MascotaAlertaResponse | null;
  onClose: () => void;
};

const AlertasMedicasPanel = ({ mascotaNombre, datos, onClose }: Props) => {
  if (!datos) return null;

  const sections = [
    { label: "Alergias", value: datos.alergias, color: "#dc2626", icon: "bi-allergies" },
    { label: "Enfermedades Crónicas", value: datos.enfermedadesCronicas, color: "#ea580c", icon: "bi-activity" },
    { label: "Alertas Médicas", value: datos.alertasMedicas, color: "#d97706", icon: "bi-exclamation-triangle" },
    { label: "Notas Médicas", value: datos.notasMedicas, color: "#2563eb", icon: "bi-journal-text" },
  ];

  const activeSections = sections.filter((s) => s.value && s.value.trim() !== "");

  return (
    <div
      className="modal d-block"
      tabIndex={-1}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content" style={{ border: "none", borderRadius: "var(--radio-borde-grande)" }}>
          <div
            className="modal-header"
            style={{
              background: "linear-gradient(135deg, #dc2626, #ea580c)",
              color: "white",
              borderRadius: "var(--radio-borde-grande) var(--radio-borde-grande) 0 0",
            }}
          >
            <h6 className="modal-title" style={{ fontWeight: "var(--peso-extranegrita)" }}>
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              Alertas Médicas — {mascotaNombre}
            </h6>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body" style={{ padding: "var(--espaciado-lg)" }}>
            {activeSections.length === 0 ? (
              <p className="text-center" style={{ color: "var(--color-texto-secundario)" }}>
                No hay alertas médicas registradas.
              </p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {activeSections.map((section) => (
                  <div
                    key={section.label}
                    style={{
                      borderLeft: `4px solid ${section.color}`,
                      padding: "var(--espaciado-sm) var(--espaciado-md)",
                      backgroundColor: `${section.color}10`,
                      borderRadius: "0 var(--radio-borde-pequeno) var(--radio-borde-pequeno) 0",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "var(--tamano-xs)",
                        fontWeight: "var(--peso-negrita)",
                        color: section.color,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: "var(--espaciado-xs)",
                      }}
                    >
                      <i className={`bi ${section.icon} me-1`}></i>
                      {section.label}
                    </div>
                    <div
                      style={{
                        fontSize: "var(--tamano-sm)",
                        color: "var(--color-texto)",
                        lineHeight: 1.5,
                      }}
                    >
                      {section.value}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertasMedicasPanel;
