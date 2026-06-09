type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning";
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="dialogo-fondo" onClick={onCancel}></div>
      <div className="dialogo-contenedor" aria-hidden="false" aria-modal="true" role="dialog">
        <div className="dialogo-ventana" style={{ maxWidth: 420 }}>
          <div className="dialogo-encabezado">
            <h5 className="dialogo-titulo">
              <i className={`bi ${variant === 'danger' ? 'bi-exclamation-triangle-fill text-danger' : 'bi-exclamation-circle-fill text-warning'} me-1`}></i>
              {title}
            </h5>
            <button type="button" className="dialogo-cerrar" aria-label="Cerrar" onClick={onCancel}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          <div className="dialogo-cuerpo">
            <p style={{ margin: 0, color: 'var(--color-texto-secundario)', fontSize: 'var(--tamano-sm)' }}>{message}</p>
          </div>
          <div className="dialogo-pie">
            <button type="button" className="boton boton--neutro" onClick={onCancel}>{cancelText}</button>
            <button
              type="button"
              className={`boton ${variant === 'danger' ? 'boton--peligro' : 'boton--advertencia'}`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialog;
