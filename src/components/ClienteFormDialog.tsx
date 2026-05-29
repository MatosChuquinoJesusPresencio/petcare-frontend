import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import type { DuenoRequest } from "../types/clienteType";

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
  userId: string;
};

const initialFormState: DuenoFormState = {
  firstName: "",
  lastName: "",
  dni: "",
  email: "",
  phone: "",
  address: "",
  userId: "",
};

function mapRequestToFormState(data: DuenoRequest): DuenoFormState {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    dni: data.dni,
    email: data.email,
    phone: data.phone ?? "",
    address: data.address ?? "",
    userId: data.userId !== null && data.userId !== undefined ? String(data.userId) : "",
  };
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setFormData(
        initialData && isOpen
          ? mapRequestToFormState(initialData)
          : initialFormState
      );
      setSubmitError("");
      setIsSubmitting(false);
    });

    return () => clearTimeout(timer);
  }, [initialData, isOpen]);

  if (!isOpen) {
    return null;
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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

    // Validaciones de frontend
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setSubmitError("Completa el nombre y apellido del dueño.");
      return;
    }

    if (!formData.dni.trim()) {
      setSubmitError("El DNI es obligatorio.");
      return;
    }

    if (formData.dni.trim().length < 8 || formData.dni.trim().length > 20) {
      setSubmitError("El DNI debe tener entre 8 y 20 caracteres.");
      return;
    }

    if (!formData.email.trim()) {
      setSubmitError("El correo electrónico es obligatorio.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      await onSubmit({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        dni: formData.dni.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        address: formData.address.trim() || undefined,
        userId: formData.userId ? Number(formData.userId) : null,
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
    <>
      <div className="modal-backdrop fade show"></div>
      <div
        className="modal fade show d-block"
        id="duenoModal"
        aria-hidden="false"
        aria-modal="true"
        role="dialog"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {mode === "edit" ? "Editar dueño" : "Nuevo dueño"}
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Cerrar"
                onClick={onClose}
                disabled={isSubmitting}
              ></button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nombre *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Apellido *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">DNI / Documento *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="dni"
                      value={formData.dni}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Teléfono</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">ID de Usuario Vinculado</label>
                    <input
                      type="number"
                      className="form-control"
                      name="userId"
                      value={formData.userId}
                      onChange={handleChange}
                      placeholder="Ej. 42"
                    />
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

                {submitError ? (
                  <div className="alert alert-danger mt-3 mb-0" role="alert">
                    {submitError}
                  </div>
                ) : null}

                <div className="d-flex justify-content-center gap-3 modal-footer mt-4">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Guardando..."
                      : mode === "edit"
                        ? "Actualizar"
                        : "Guardar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        #duenoModal .modal-body,
        #duenoModal .modal-body .form-label,
        #duenoModal .modal-body .form-control,
        #duenoModal .modal-header .modal-title {
          color: #000 !important;
        }
        #duenoModal .modal-body .form-control {
          border-color: #ced4da;
        }
      `}</style>
    </>
  );
};

export default DuenoFormDialog;