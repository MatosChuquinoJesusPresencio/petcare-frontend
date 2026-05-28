import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import type { ContactoEmergenciaRequest } from "../types/contacto";

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
    if (isOpen) {
      setFormData(initialFormState);
      setSubmitError("");
      setIsSubmitting(false);
      return;
    }

    setFormData(initialFormState);
    setSubmitError("");
    setIsSubmitting(false);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

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
    <>
      <div className="modal-backdrop fade show"></div>
      <div
        className="modal fade show d-block"
        id="contactoModal"
        aria-hidden="false"
        aria-modal="true"
        role="dialog"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Agregar contacto de emergencia</h5>
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
                    {isSubmitting ? "Vinculando..." : "Asociar Contacto"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactoFormDialog;