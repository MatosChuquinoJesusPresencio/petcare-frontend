import type { FormEvent, ReactNode } from "react";

interface BaseFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void | Promise<void>;
  title: string;
  submitLabel?: string;
  submitBusyLabel?: string;
  isSubmitting: boolean;
  submitError: string;
  modalId: string;
  size?: "sm" | "md" | "lg";
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
      <div className="dialogo-fondo" onClick={!isSubmitting ? onClose : undefined}></div>
      <div className="dialogo-contenedor" id={modalId} aria-hidden="false" aria-modal="true" role="dialog" tabIndex={-1}>
        <div className={`dialogo-ventana${size === 'lg' ? ' dialogo-ventana--grande' : ''}`}>
          <div className="dialogo-encabezado">
            <h5 className="dialogo-titulo">{title}</h5>
            <button type="button" className="dialogo-cerrar" aria-label="Cerrar" onClick={onClose} disabled={isSubmitting}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          <div className="dialogo-cuerpo">
            <form onSubmit={onSubmit} noValidate>
              {children}

              {submitError && (
                <div className="dialogo-error" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-1"></i>
                  {submitError}
                </div>
              )}

              <div className="dialogo-pie">
                <button type="button" className="boton boton--neutro" onClick={onClose} disabled={isSubmitting}>
                  Cancelar
                </button>
                <button type="submit" className="boton boton--primario" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><span className="spinner-border spinner-border-sm me-1" role="status"></span>{submitBusyLabel}</>
                  ) : submitLabel}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
