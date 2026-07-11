import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import BaseFormDialog from "../common/BaseFormDialog";
import type { ContactoEmergenciaRequest } from "../../types";

type ContactoFormDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ContactoEmergenciaRequest) => Promise<void>;
};

type ContactoFormState = {
  name: string;
  phone: string;
  relation: string;
};

const initialFormState: ContactoFormState = {
  name: "",
  phone: "",
  relation: "",
};

function validate(formData: ContactoFormState): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!formData.name.trim()) {
    errors.name = "El nombre del contacto es obligatorio.";
  } else if (formData.name.trim().length < 2) {
    errors.name = "Mínimo 2 caracteres.";
  } else if (formData.name.trim().length > 100) {
    errors.name = "Máximo 100 caracteres.";
  }

  if (!formData.phone.trim()) {
    errors.phone = "El número telefónico es obligatorio.";
  } else if (!/^\d{9}$/.test(formData.phone.trim())) {
    errors.phone = "El teléfono debe tener exactamente 9 dígitos.";
  }

  return errors;
}

const ContactoFormDialog = ({
  isOpen,
  onClose,
  onSubmit,
}: ContactoFormDialogProps) => {
  const [formData, setFormData] = useState<ContactoFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setFormData(initialFormState);
      setSubmitError("");
      setFieldErrors({});
      setIsSubmitting(false);
    });

    return () => clearTimeout(timer);
  }, [isOpen]);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
        phone: formData.phone.trim(),
        relation: formData.relation.trim() || undefined,
      });

      onClose();
    } catch (error) {
      console.error("Error al registrar contacto:", error);
      setSubmitError("No se pudo asociar el contacto de emergencia. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <BaseFormDialog
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Agregar contacto de emergencia"
      submitLabel="Asociar Contacto"
      submitBusyLabel="Vinculando..."
      isSubmitting={isSubmitting}
      submitError={submitError}
      modalId="contactoModal"
      size="md"
    >
      <div className="row g-3">
        <div className="col-12">
          <div className="campo-grupo">
            <label className="campo-etiqueta">Nombre del contacto *</label>
            <input
              type="text"
              className={`campo-entrada ${fieldErrors.name ? 'campo-entrada--error' : ''}`}
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej. María López"
              required
            />
            {fieldErrors.name && <div className="campo-error">{fieldErrors.name}</div>}
          </div>
        </div>

        <div className="col-12">
          <div className="campo-grupo">
            <label className="campo-etiqueta">Número de teléfono *</label>
            <input
              type="text"
              className={`campo-entrada ${fieldErrors.phone ? 'campo-entrada--error' : ''}`}
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Ej. 987654321"
              required
            />
            {fieldErrors.phone && <div className="campo-error">{fieldErrors.phone}</div>}
          </div>
        </div>

        <div className="col-12">
          <div className="campo-grupo">
            <label className="campo-etiqueta">Relación / Vínculo (Opcional)</label>
            <input
              type="text"
              className="campo-entrada"
              name="relation"
              value={formData.relation}
              onChange={handleChange}
              placeholder="Ej. Familiar, Hermano, Vecino"
            />
          </div>
        </div>
      </div>
    </BaseFormDialog>
  );
};

export default ContactoFormDialog;
