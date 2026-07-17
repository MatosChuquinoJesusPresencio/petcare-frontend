import { useEffect, useState } from "react";

import type { Dueno } from "../../types";
import { getDuenos, cambiarDuenoPrincipal } from "../../services";
import { getErrorMessage } from "../../utils/errorHandler";
import BaseFormDialog from "../common/BaseFormDialog";

interface Props {
  show: boolean;
  mascotaId: number | null;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

export default function MascotaVincularModal({
  show,
  mascotaId,
  onClose,
  onSuccess,
}: Props) {
  const [duenos, setDuenos] = useState<Dueno[]>([]);
  const [duenoId, setDuenoId] = useState(0);
  const [relacion, setRelacion] = useState("Tutor");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const cargarDuenos = async () => {
    try {
      const data = await getDuenos();
      setDuenos(data);
    } catch {
      setSubmitError("Error al cargar dueños");
    }
  };

  useEffect(() => {
    if (show) {
      const t = setTimeout(cargarDuenos);
      return () => clearTimeout(t);
    }
  }, [show]);

  const validate = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!duenoId) {
      errors.duenoId = "Selecciona un dueño.";
    }
    if (!relacion.trim()) {
      errors.relacion = "La relación es obligatoria.";
    } else if (relacion.trim().length < 2) {
      errors.relacion = "Mínimo 2 caracteres.";
    } else if (relacion.trim().length > 50) {
      errors.relacion = "Máximo 50 caracteres.";
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mascotaId) return;

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    setSaving(true);
    setSubmitError("");
    try {
      await cambiarDuenoPrincipal(mascotaId, { ownerId: duenoId, relation: relacion, reason: "Cambio manual desde el sistema" });
      await onSuccess();
      onClose();
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (!show) return null;

  return (
    <BaseFormDialog
      isOpen={show}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Cambiar Dueño Principal"
      submitLabel="Cambiar dueño principal"
      isSubmitting={saving}
      submitError={submitError}
      modalId="vincular-modal"
      size="md"
    >
      <div className="campo-grupo">
        <label className="campo-etiqueta">Dueño</label>
        <select
          className={`campo-entrada ${fieldErrors.duenoId ? 'campo-entrada--error' : ''}`}
          value={duenoId}
          onChange={(e) => { setDuenoId(Number(e.target.value)); setFieldErrors((p) => { const n = { ...p }; delete n.duenoId; return n; }); }}
          required
        >
          <option value="">Seleccione dueño</option>
          {duenos.map((dueno) => (
            <option key={dueno.id} value={dueno.id}>
              {dueno.usuario ? `${dueno.usuario.names} ${dueno.usuario.lastNames}` : `DNI: ${dueno.dni}`}
            </option>
          ))}
        </select>
        {fieldErrors.duenoId && <div className="campo-error">{fieldErrors.duenoId}</div>}
      </div>

      <div className="campo-grupo">
        <label className="campo-etiqueta">Relación</label>
        <input
          type="text"
          className={`campo-entrada ${fieldErrors.relacion ? 'campo-entrada--error' : ''}`}
          value={relacion}
          onChange={(e) => { setRelacion(e.target.value); setFieldErrors((p) => { const n = { ...p }; delete n.relacion; return n; }); }}
          required
        />
        {fieldErrors.relacion && <div className="campo-error">{fieldErrors.relacion}</div>}
      </div>
    </BaseFormDialog>
  );
}
