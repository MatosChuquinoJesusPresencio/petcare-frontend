import { useEffect, useRef } from "react";

export interface ToastInfo {
  message: string;
  type: "success" | "error";
}

interface NotificationToastProps {
  toast: ToastInfo | null;
  onClose: () => void;
  duration?: number;
}

export default function NotificationToast({
  toast,
  onClose,
  duration = 5000,
}: NotificationToastProps) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => onCloseRef.current(), duration);
    return () => clearTimeout(t);
  }, [toast, duration]);

  if (!toast) return null;

  return (
    <div className="notificacion-contenedor">
      <div className={`notificacion notificacion--${toast.type}`} role="alert">
        <span className="notificacion-icono">
          <i className={`bi ${toast.type === "error" ? "bi-exclamation-triangle-fill" : "bi-check-circle-fill"}`}></i>
        </span>
        <span className="notificacion-mensaje">{toast.message}</span>
        <button type="button" className="notificacion-cerrar" onClick={onClose} aria-label="Cerrar">
          <i className="bi bi-x-lg"></i>
        </button>
      </div>
    </div>
  );
}
