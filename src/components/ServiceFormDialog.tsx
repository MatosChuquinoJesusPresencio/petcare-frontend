import { useEffect, useState } from "react";
import type { ChangeEvent, SubmitEvent } from "react";

import type { ServicioRequest } from "../types/serviciosType";

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

  useEffect(() => {
    if (isOpen) {
      setFormData(
        initialData ? mapRequestToFormState(initialData) : initialFormState
      );
      setSubmitError("");
      setIsSubmitting(false);
      return;
    }

    setFormData(initialFormState);
    setSubmitError("");
    setIsSubmitting(false);
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

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");

    if (!formData.name.trim()) {
      setSubmitError("Completa el nombre del servicio.");
      return;
    }

    if (!formData.durationMinutes || !formData.referentialCost) {
      setSubmitError("Completa duración y costo referencial.");
      return;
    }

    const durationMinutes = Number(formData.durationMinutes);
    const referentialCost = Number(formData.referentialCost);

    if (!Number.isFinite(durationMinutes) || !Number.isFinite(referentialCost)) {
      setSubmitError("Duración y costo deben ser numéricos.");
      return;
    }

    if (durationMinutes < 5 || referentialCost < 0) {
      setSubmitError("Duración y costo deben tener valores válidos.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        name: formData.name.trim(),
        description: formData.description.trim(),
        durationMinutes,
        referentialCost,
      });
      onClose();
    } catch (error) {
      console.error("Error al crear servicio:", error);
      setSubmitError("No se pudo guardar el servicio. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div
        className="modal fade show d-block"
        id="serviceModal"
        aria-hidden="false"
        aria-modal="true"
        role="dialog"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {mode === "edit" ? "Editar servicio" : "Nuevo servicio"}
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Cerrar"
                onClick={onClose}
              ></button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nombre del servicio</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Duración (minutos)</label>
                    <input
                      type="number"
                      className="form-control"
                      min="5"
                      name="durationMinutes"
                      value={formData.durationMinutes}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Descripción</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Costo referencial</label>
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      step="0.01"
                      name="referentialCost"
                      value={formData.referentialCost}
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
    </>
  );
};

export default ServiceFormDialog;
