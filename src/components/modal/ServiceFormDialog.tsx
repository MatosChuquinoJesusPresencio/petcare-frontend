import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import BaseFormDialog from "../BaseFormDialog";
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
    const next = initialData ? mapRequestToFormState(initialData) : initialFormState;
    const timer = setTimeout(() => {
      setFormData(next);
      setSubmitError("");
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
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
    </BaseFormDialog>
  );
};

export default ServiceFormDialog;
