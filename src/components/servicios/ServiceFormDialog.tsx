import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import BaseFormDialog from "../common/BaseFormDialog";
import { getErrorMessage } from "../../utils/errorHandler";
import type { ServicioRequest } from "../../types";

type ServiceFormDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ServicioRequest | null;
  mode: "create" | "edit";
  onSubmit: (data: ServicioRequest) => Promise<void>;
};

type ServiceFormState = {
  name: string;
  description: string;
  durationMinutes: string;
  referentialCost: string;
};

const initialFormState: ServiceFormState = {
  name: "",
  description: "",
  durationMinutes: "",
  referentialCost: "",
};

function mapRequestToFormState(data: ServicioRequest): ServiceFormState {
  return {
    name: data.name,
    description: data.description,
    durationMinutes: String(data.durationMinutes),
    referentialCost: String(data.referentialCost),
  };
}

function validate(formData: ServiceFormState): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!formData.name.trim()) {
    errors.name = "El nombre del servicio es obligatorio.";
  } else if (formData.name.trim().length < 2) {
    errors.name = "Mínimo 2 caracteres.";
  } else if (formData.name.trim().length > 100) {
    errors.name = "Máximo 100 caracteres.";
  }

  if (formData.description && formData.description.length > 500) {
    errors.description = "Máximo 500 caracteres.";
  }

  if (!formData.durationMinutes) {
    errors.durationMinutes = "La duración es obligatoria.";
  } else {
    const dur = Number(formData.durationMinutes);
    if (!Number.isFinite(dur)) {
      errors.durationMinutes = "Debe ser un número válido.";
    } else if (dur < 5) {
      errors.durationMinutes = "Mínimo 5 minutos.";
    } else if (dur > 480) {
      errors.durationMinutes = "Máximo 480 minutos (8 horas).";
    }
  }

  if (!formData.referentialCost) {
    errors.referentialCost = "El costo referencial es obligatorio.";
  } else {
    const cost = Number(formData.referentialCost);
    if (!Number.isFinite(cost)) {
      errors.referentialCost = "Debe ser un número válido.";
    } else if (cost < 0) {
      errors.referentialCost = "El costo no puede ser negativo.";
    }
  }

  return errors;
}

const ServiceFormDialog = ({
  isOpen,
  onClose,
  initialData,
  mode,
  onSubmit,
}: ServiceFormDialogProps) => {
  const [formData, setFormData] = useState<ServiceFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const next = initialData ? mapRequestToFormState(initialData) : initialFormState;
    const timer = setTimeout(() => {
      setFormData(next);
      setSubmitError("");
      setFieldErrors({});
      setIsSubmitting(false);
    });

    return () => clearTimeout(timer);
  }, [initialData, isOpen]);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
        name: formData.name.trim(),
        description: formData.description.trim(),
        durationMinutes: Number(formData.durationMinutes),
        referentialCost: Number(formData.referentialCost),
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
      title={mode === "edit" ? "Editar servicio" : "Nuevo servicio"}
      submitLabel={mode === "edit" ? "Actualizar" : "Guardar"}
      submitBusyLabel="Guardando..."
      isSubmitting={isSubmitting}
      submitError={submitError}
      modalId="serviceModal"
    >
      <div className="row g-3">
        <div className="col-md-6">
          <div className="campo-grupo">
            <label className="campo-etiqueta">Nombre del servicio</label>
            <input
              type="text"
              className={`campo-entrada ${fieldErrors.name ? 'campo-entrada--error' : ''}`}
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {fieldErrors.name && <div className="campo-error">{fieldErrors.name}</div>}
          </div>
        </div>

        <div className="col-md-6">
          <div className="campo-grupo">
            <label className="campo-etiqueta">Duración (minutos)</label>
            <input
              type="number"
              className={`campo-entrada ${fieldErrors.durationMinutes ? 'campo-entrada--error' : ''}`}
              min="5"
              name="durationMinutes"
              value={formData.durationMinutes}
              onChange={handleChange}
            />
            {fieldErrors.durationMinutes && <div className="campo-error">{fieldErrors.durationMinutes}</div>}
          </div>
        </div>

        <div className="col-12">
          <div className="campo-grupo">
            <label className="campo-etiqueta">Descripción</label>
            <textarea
              className={`campo-entrada ${fieldErrors.description ? 'campo-entrada--error' : ''}`}
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
            {fieldErrors.description && <div className="campo-error">{fieldErrors.description}</div>}
          </div>
        </div>

        <div className="col-md-6">
          <div className="campo-grupo">
            <label className="campo-etiqueta">Costo referencial</label>
            <input
              type="number"
              className={`campo-entrada ${fieldErrors.referentialCost ? 'campo-entrada--error' : ''}`}
              min="0"
              step="0.01"
              name="referentialCost"
              value={formData.referentialCost}
              onChange={handleChange}
            />
            {fieldErrors.referentialCost && <div className="campo-error">{fieldErrors.referentialCost}</div>}
          </div>
        </div>
      </div>
    </BaseFormDialog>
  );
};

export default ServiceFormDialog;
