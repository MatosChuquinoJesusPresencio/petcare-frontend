import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import BaseFormDialog from "../common/BaseFormDialog";
import type { DuenoRequest } from "../../types";

type DuenoFormDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: DuenoRequest | null;
  mode: "create" | "edit";
  onSubmit: (data: DuenoRequest) => Promise<void>;
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

function mapRequestToFormState(data: DuenoRequest): DuenoFormState {
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
          ? mapRequestToFormState(initialData)
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
        phone: formData.phone.trim() || undefined,
        address: formData.address.trim() || undefined,
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
          <label className="form-label">Nombre *</label>
          <input
            type="text"
            className={`form-control ${fieldErrors.firstName ? 'is-invalid' : ''}`}
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          {fieldErrors.firstName && <div className="invalid-feedback">{fieldErrors.firstName}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label">Apellido *</label>
          <input
            type="text"
            className={`form-control ${fieldErrors.lastName ? 'is-invalid' : ''}`}
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          {fieldErrors.lastName && <div className="invalid-feedback">{fieldErrors.lastName}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label">DNI / Documento *</label>
          <input
            type="text"
            className={`form-control ${fieldErrors.dni ? 'is-invalid' : ''}`}
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            required
          />
          {fieldErrors.dni && <div className="invalid-feedback">{fieldErrors.dni}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label">Email *</label>
          <input
            type="email"
            className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {fieldErrors.email && <div className="invalid-feedback">{fieldErrors.email}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label">Teléfono</label>
          <input
            type="text"
            className={`form-control ${fieldErrors.phone ? 'is-invalid' : ''}`}
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          {fieldErrors.phone && <div className="invalid-feedback">{fieldErrors.phone}</div>}
        </div>

        <div className="col-12">
          <label className="form-label">Dirección habitual</label>
          <input
            type="text"
            className="form-control"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
      </div>
    </BaseFormDialog>
  );
};

export default DuenoFormDialog;
