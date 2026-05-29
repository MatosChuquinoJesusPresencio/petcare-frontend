import type { FormEvent, ReactNode } from "react";

interface BaseFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  title: string;
  submitLabel?: string;
  submitBusyLabel?: string;
  isSubmitting: boolean;
  submitError: string;
  modalId: string;
  size?: "md" | "lg";
  children: ReactNode;
}

export default function BaseFormDialog({
  isOpen,
  onClose,
  onSubmit,
  title,
  submitLabel = "Guardar",
  submitBusyLabel = "Guardando...",
  isSubmitting,
  submitError,
  modalId,
  size = "lg",
  children,
}: BaseFormDialogProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div
        className="modal fade show d-block"
        id={modalId}
        aria-hidden="false"
        aria-modal="true"
        role="dialog"
        tabIndex={-1}
      >
        <div className={`modal-dialog modal-${size} modal-dialog-centered modal-force-dark-text`}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Cerrar"
                onClick={onClose}
                disabled={isSubmitting}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={onSubmit}>
                {children}

                {submitError && (
                  <div className="alert alert-danger mt-3 mb-0" role="alert">
                    {submitError}
                  </div>
                )}

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
                    {isSubmitting ? submitBusyLabel : submitLabel}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
