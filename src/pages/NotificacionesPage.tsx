import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/common/DataTable";
import NotificationToast from "../components/common/NotificationToast";
import type { ToastInfo } from "../components/common/NotificationToast";
import { notificacionService } from "../services";
import type { NotificacionResponse } from "../types";
import { getErrorMessage } from "../utils/errorHandler";

const NotificacionesPage = () => {
  const { user } = useAuth();
  const [notificaciones, setNotificaciones] = useState<NotificacionResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [toast, setToast] = useState<ToastInfo | null>(null);

  const cargarDatos = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setLoadError("");
      const data = await notificacionService.listarPorUsuario(user.id);
      setNotificaciones(data);
    } catch (err) {
      setLoadError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { const t = setTimeout(cargarDatos); return () => clearTimeout(t); }, [cargarDatos]);

  const handleMarcarLeidas = async () => {
    if (!user) return;
    try {
      await notificacionService.marcarComoLeidas(user.id);
      setNotificaciones((prev) => prev.map((n) => ({ ...n, leido: true })));
      setToast({ message: "Notificaciones marcadas como leídas.", type: "success" });
    } catch (err) {
      setToast({ message: getErrorMessage(err), type: "error" });
    }
  };

  function formatDate(iso: string): string {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch { return iso; }
  }

  const noLeidas = notificaciones.filter((n) => !n.leido).length;

  return (
    <div className="contenedor-pagina">
      <div className="container">
        <NotificationToast toast={toast} onClose={() => setToast(null)} />
        <PageHeader icon="bi-bell" title="Notificaciones" description="Tus notificaciones del sistema">
          {noLeidas > 0 && (
            <button className="boton boton--primario" onClick={handleMarcarLeidas}>
              <i className="bi bi-check-all me-1"></i>Marcar como leídas ({noLeidas})
            </button>
          )}
        </PageHeader>

        <div className="tarjeta animacion-entrada" style={{ animationDelay: "0.05s" }}>
          <div className="tarjeta-cuerpo">
            {loadError ? (
              <div className="dialogo-error" style={{ marginBottom: 0 }}>{loadError}</div>
            ) : loading ? (
              <div className="estado-cargando">
                <div className="spinner-border" style={{ color: "var(--color-primario)" }} role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : (
              <DataTable columns={["#", "Tipo", "Mensaje", "Leído", "Fecha"]} emptyMessage="No hay notificaciones." colSpan={5}>
                {notificaciones.map((n, i) => (
                  <tr key={n.id} style={{ background: n.leido ? '#fff' : '#eff6ff' }}>
                    <td><span className="numero-fila">{i + 1}</span></td>
                    <td><span className="etiqueta etiqueta--activo">{n.tipo.replace(/_/g, ' ')}</span></td>
                    <td style={{ maxWidth: 350 }}>{n.mensaje}</td>
                    <td>
                      <span className={`etiqueta ${n.leido ? 'etiqueta--inactivo' : 'etiqueta--activo'}`}>
                        {n.leido ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>{formatDate(n.creadoEn)}</td>
                  </tr>
                ))}
              </DataTable>
            )}
          </div>
          <div className="tarjeta-pie" style={{ fontSize: "var(--tamano-sm)", color: "var(--color-texto-claro)" }}>
            Total: {notificaciones.length} | No leídas: {noLeidas}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificacionesPage;
