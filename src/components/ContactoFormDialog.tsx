import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import BaseFormDialog from "./BaseFormDialog";
import type { ContactoEmergenciaRequest } from "../types";

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

const ContactoFormDialog = ({
  isOpen,
  onClose,
  onSubmit,
}: ContactoFormDialogProps) => {
  const [formData, setFormData] = useState<ContactoFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setFormData(initialFormState);
      setSubmitError("");
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
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");

    if (!formData.name.trim()) {
      setSubmitError("Ingresa el nombre completo del contacto.");
      return;
    }

    if (!formData.phone.trim()) {
      setSubmitError("El número telefónico es obligatorio.");
      return;
    }

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
          <label className="form-label">Nombre del contacto *</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ej. María López"
            required
          />
        </div>

        <div className="col-12">
          <label className="form-label">Número de teléfono *</label>
          <input
            type="text"
            className="form-control"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Ej. 987654321"
            required
          />
        </div>

        <div className="col-12">
          <label className="form-label">Relación / Vínculo (Opcional)</label>
          <input
            type="text"
            className="form-control"
            name="relation"
            value={formData.relation}
            onChange={handleChange}
            placeholder="Ej. Familiar, Hermano, Vecino"
          />
        </div>
      </div>
    </BaseFormDialog>
  );
};

export default ContactoFormDialog;
