import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import BaseFormDialog from "../common/BaseFormDialog";

export interface DuenoFormData {
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  phone: string;
  address: string;
}

type DuenoFormDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: DuenoFormData | null;
  mode: "create" | "edit";
  onSubmit: (data: DuenoFormData) => Promise<void>;
};

type DuenoFormState = {
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  phone: string;
  address: string;
};

const initialFormState: DuenoFormState = {
  firstName: "",
  lastName: "",
  dni: "",
  email: "",
  phone: "",
  address: "",
};

function mapDataToFormState(data: DuenoFormData): DuenoFormState {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    dni: data.dni,
    email: data.email,
    phone: data.phone ?? "",
    address: data.address ?? "",
  };
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(formData: DuenoFormState): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!formData.firstName.trim()) {
    errors.firstName = "El nombre es obligatorio.";
  } else if (formData.firstName.trim().length < 2) {
    errors.firstName = "Mínimo 2 caracteres.";
  } else if (formData.firstName.trim().length > 50) {
    errors.firstName = "Máximo 50 caracteres.";
  }

  if (!formData.lastName.trim()) {
    errors.lastName = "El apellido es obligatorio.";
  } else if (formData.lastName.trim().length < 2) {
    errors.lastName = "Mínimo 2 caracteres.";
  } else if (formData.lastName.trim().length > 50) {
    errors.lastName = "Máximo 50 caracteres.";
  }

  if (!formData.dni.trim()) {
    errors.dni = "El DNI es obligatorio.";
  } else if (!/^\d+$/.test(formData.dni.trim())) {
    errors.dni = "El DNI debe contener solo dígitos.";
  } else if (formData.dni.trim().length < 8) {
    errors.dni = "Mínimo 8 dígitos.";
  } else if (formData.dni.trim().length > 20) {
    errors.dni = "Máximo 20 dígitos.";
  }

  if (!formData.email.trim()) {
    errors.email = "El correo electrónico es obligatorio.";
  } else if (!EMAIL_REGEX.test(formData.email.trim())) {
    errors.email = "Ingresa un correo válido (ej. usuario@dominio.com).";
  }

  if (formData.phone.trim() && !/^[\d\s+\-()]{6,20}$/.test(formData.phone.trim())) {
    errors.phone = "Ingresa un teléfono válido (6-20 dígitos).";
  }

  return errors;
}

const DuenoFormDialog = ({
  isOpen,
  onClose,
  initialData,
  mode,
  onSubmit,
}: DuenoFormDialogProps) => {
  const [formData, setFormData] = useState<DuenoFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setFormData(
        initialData && isOpen
          ? mapDataToFormState(initialData)
          : initialFormState
      );
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
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        dni: formData.dni.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || "",
        address: formData.address.trim() || "",
      });

      onClose();
    } catch (error) {
      console.error("Error al procesar dueño:", error);
      setSubmitError("No se pudo guardar el registro del dueño. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <BaseFormDialog
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={mode === "edit" ? "Editar dueño" : "Nuevo dueño"}
      submitLabel={mode === "edit" ? "Actualizar" : "Guardar"}
      submitBusyLabel="Guardando..."
      isSubmitting={isSubmitting}
      submitError={submitError}
      modalId="duenoModal"
    >
      <div className="row g-3">
        <div className="col-md-6">
          <div className="campo-grupo">
            <label className="campo-etiqueta">Nombre *</label>
            <input
              type="text"
              className={`campo-entrada ${fieldErrors.firstName ? 'campo-entrada--error' : ''}`}
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            {fieldErrors.firstName && <div className="campo-error">{fieldErrors.firstName}</div>}
          </div>
        </div>

        <div className="col-md-6">
          <div className="campo-grupo">
            <label className="campo-etiqueta">Apellido *</label>
            <input
              type="text"
              className={`campo-entrada ${fieldErrors.lastName ? 'campo-entrada--error' : ''}`}
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            {fieldErrors.lastName && <div className="campo-error">{fieldErrors.lastName}</div>}
          </div>
        </div>

        <div className="col-md-6">
          <div className="campo-grupo">
            <label className="campo-etiqueta">DNI / Documento *</label>
            <input
              type="text"
              className={`campo-entrada ${fieldErrors.dni ? 'campo-entrada--error' : ''}`}
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              required
            />
            {fieldErrors.dni && <div className="campo-error">{fieldErrors.dni}</div>}
          </div>
        </div>

        <div className="col-md-6">
          <div className="campo-grupo">
            <label className="campo-etiqueta">Email *</label>
            <input
              type="email"
              className={`campo-entrada ${fieldErrors.email ? 'campo-entrada--error' : ''}`}
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {fieldErrors.email && <div className="campo-error">{fieldErrors.email}</div>}
          </div>
        </div>

        <div className="col-md-6">
          <div className="campo-grupo">
            <label className="campo-etiqueta">Teléfono</label>
            <input
              type="text"
              className={`campo-entrada ${fieldErrors.phone ? 'campo-entrada--error' : ''}`}
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            {fieldErrors.phone && <div className="campo-error">{fieldErrors.phone}</div>}
          </div>
        </div>

        <div className="col-12">
          <div className="campo-grupo">
            <label className="campo-etiqueta">Dirección habitual</label>
            <input
              type="text"
              className="campo-entrada"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </BaseFormDialog>
  );
};

export default DuenoFormDialog;
