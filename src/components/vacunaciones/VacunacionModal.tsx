import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import BaseFormDialog from "../common/BaseFormDialog";
import SearchableSelect from "../common/SearchableSelect";
import { getErrorMessage } from "../../utils/errorHandler";
import type { HistorialVacunacionRequest, VeterinarioResponse } from "../../types";
import { TIPOS_VACUNACION, VACUNACION_TIPO_LABEL } from "../../constants/vacunacionConstants";
import { obtenerVeterinarios } from "../../services";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  initialData?: HistorialVacunacionRequest | null;
  onSubmit: (data: HistorialVacunacionRequest) => Promise<void>;
};

type FormState = {
  tipo: string;
  nombreProducto: string;
  fechaAplicacion: string;
  proximaDosis: string;
  lote: string;
  fabricante: string;
  dosis: string;
  viaAdministracion: string;
  veterinarioId: string;
  observaciones: string;
};

const initialForm: FormState = {
  tipo: "VACUNA",
  nombreProducto: "",
  fechaAplicacion: "",
  proximaDosis: "",
  lote: "",
  fabricante: "",
  dosis: "",
  viaAdministracion: "",
  veterinarioId: "",
  observaciones: "",
};

function validate(f: FormState): Record<string, string> {
  const e: Record<string, string> = {};
  if (!f.tipo) e.tipo = "El tipo es obligatorio.";
  if (!f.nombreProducto.trim()) e.nombreProducto = "El nombre del producto es obligatorio.";
  if (!f.fechaAplicacion) e.fechaAplicacion = "La fecha de aplicación es obligatoria.";
  if (!f.veterinarioId) e.veterinarioId = "El veterinario es obligatorio.";
  return e;
}

const VacunacionModal = ({ isOpen, onClose, mode, initialData, onSubmit }: Props) => {
  const [formData, setFormData] = useState<FormState>(initialForm);
  const [veterinarios, setVeterinarios] = useState<VeterinarioResponse[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) return;
    obtenerVeterinarios().then(setVeterinarios).catch(() => {});
    const next: FormState = initialData
      ? {
          tipo: initialData.tipo,
          nombreProducto: initialData.nombreProducto,
          fechaAplicacion: initialData.fechaAplicacion,
          proximaDosis: initialData.proximaDosis || "",
          lote: initialData.lote || "",
          fabricante: initialData.fabricante || "",
          dosis: initialData.dosis || "",
          viaAdministracion: initialData.viaAdministracion || "",
          veterinarioId: String(initialData.veterinarioId),
          observaciones: initialData.observaciones || "",
        }
      : initialForm;
    setTimeout(() => {
      setFormData(next);
      setSubmitError("");
      setFieldErrors({});
      setIsSubmitting(false);
    });
  }, [initialData, isOpen]);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData((c) => ({ ...c, [name]: value }));
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const n = { ...prev };
      delete n[name];
      return n;
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError("");
    const errors = validate(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    try {
      setIsSubmitting(true);
      await onSubmit({
        tipo: formData.tipo,
        nombreProducto: formData.nombreProducto.trim(),
        fechaAplicacion: formData.fechaAplicacion,
        proximaDosis: formData.proximaDosis || undefined,
        lote: formData.lote || undefined,
        fabricante: formData.fabricante || undefined,
        dosis: formData.dosis || undefined,
        viaAdministracion: formData.viaAdministracion || undefined,
        veterinarioId: Number(formData.veterinarioId),
        observaciones: formData.observaciones || undefined,
      });
      onClose();
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <BaseFormDialog
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={mode === "edit" ? "Editar vacunación" : "Registrar vacunación"}
      submitLabel={mode === "edit" ? "Actualizar" : "Guardar"}
      submitBusyLabel="Guardando..."
      isSubmitting={isSubmitting}
      submitError={submitError}
      modalId="vacunacionModal"
    >
      <div className="row g-3">
        <div className="col-md-6">
          <div className="campo-grupo">
            <label className="campo-etiqueta">Tipo</label>
            <select className={`campo-entrada ${fieldErrors.tipo ? "campo-entrada--error" : ""}`} name="tipo" value={formData.tipo} onChange={handleChange}>
              {TIPOS_VACUNACION.map((t) => (
                <option key={t} value={t}>{VACUNACION_TIPO_LABEL[t]}</option>
              ))}
            </select>
            {fieldErrors.tipo && <div className="campo-error">{fieldErrors.tipo}</div>}
          </div>
        </div>
        <div className="col-md-6">
          <div className="campo-grupo">
            <label className="campo-etiqueta">Nombre del producto</label>
            <input type="text" className={`campo-entrada ${fieldErrors.nombreProducto ? "campo-entrada--error" : ""}`} name="nombreProducto" value={formData.nombreProducto} onChange={handleChange} />
            {fieldErrors.nombreProducto && <div className="campo-error">{fieldErrors.nombreProducto}</div>}
          </div>
        </div>
        <div className="col-md-6">
          <div className="campo-grupo">
            <label className="campo-etiqueta">Fecha de aplicación</label>
            <input type="date" className={`campo-entrada ${fieldErrors.fechaAplicacion ? "campo-entrada--error" : ""}`} name="fechaAplicacion" value={formData.fechaAplicacion} onChange={handleChange} />
            {fieldErrors.fechaAplicacion && <div className="campo-error">{fieldErrors.fechaAplicacion}</div>}
          </div>
        </div>
        <div className="col-md-6">
          <div className="campo-grupo">
            <label className="campo-etiqueta">Próxima dosis</label>
            <input type="date" className="campo-entrada" name="proximaDosis" value={formData.proximaDosis} onChange={handleChange} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="campo-grupo">
            <label className="campo-etiqueta">Veterinario</label>
            <SearchableSelect
              label="Veterinario"
              options={veterinarios.map((v) => `${v.names} ${v.lastNames}`)}
              value={formData.veterinarioId}
              onChange={(val) => {
                setFormData((c) => ({ ...c, veterinarioId: val }));
                setFieldErrors((prev) => {
                  if (!prev.veterinarioId) return prev;
                  const n = { ...prev };
                  delete n.veterinarioId;
                  return n;
                });
              }}
              placeholder="Seleccionar veterinario..."
            />
            {fieldErrors.veterinarioId && <div className="campo-error">{fieldErrors.veterinarioId}</div>}
          </div>
        </div>
        <div className="col-md-6">
          <div className="campo-grupo">
            <label className="campo-etiqueta">Lote</label>
            <input type="text" className="campo-entrada" name="lote" value={formData.lote} onChange={handleChange} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="campo-grupo">
            <label className="campo-etiqueta">Fabricante</label>
            <input type="text" className="campo-entrada" name="fabricante" value={formData.fabricante} onChange={handleChange} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="campo-grupo">
            <label className="campo-etiqueta">Dosis</label>
            <input type="text" className="campo-entrada" name="dosis" value={formData.dosis} onChange={handleChange} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="campo-grupo">
            <label className="campo-etiqueta">Vía de administración</label>
            <input type="text" className="campo-entrada" name="viaAdministracion" value={formData.viaAdministracion} onChange={handleChange} placeholder="Ej: Subcutánea, Intramuscular" />
          </div>
        </div>
        <div className="col-12">
          <div className="campo-grupo">
            <label className="campo-etiqueta">Observaciones</label>
            <textarea className="campo-entrada" rows={2} name="observaciones" value={formData.observaciones} onChange={handleChange}></textarea>
          </div>
        </div>
      </div>
    </BaseFormDialog>
  );
};

export default VacunacionModal;
