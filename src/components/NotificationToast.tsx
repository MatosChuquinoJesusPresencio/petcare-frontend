import { useEffect } from "react";

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
  duration = 4000,
}: NotificationToastProps) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [toast, duration, onClose]);

  if (!toast) return null;

  const bg = toast.type === "error" ? "danger" : "success";

  return (
    <div
      className="position-fixed top-0 end-0 p-3"
      style={{ zIndex: 9999 }}
    >
      <div
        className={`alert alert-${bg} alert-dismissible d-flex align-items-center shadow mb-0`}
        role="alert"
      >
        <i className={`bi ${toast.type === "error" ? "bi-exclamation-triangle-fill" : "bi-check-circle-fill"} me-2`}></i>
        {toast.message}
        <button
          type="button"
          className="btn-close ms-2"
          onClick={onClose}
        ></button>
      </div>
    </div>
  );
}
