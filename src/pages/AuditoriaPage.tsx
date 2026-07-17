import { useCallback, useEffect, useState } from "react";
import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/common/DataTable";
import NotificationToast from "../components/common/NotificationToast";
import type { ToastInfo } from "../components/common/NotificationToast";
import { buscarAuditoria } from "../services";
import type { AuditoriaResponse } from "../types";
import {
  TABLAS_AUDITABLES,
  TABLA_LABEL,
  OPERACION_LABEL,
} from "../constants/auditoriaConstants";
import { getErrorMessage } from "../utils/errorHandler";

const AuditoriaPage = () => {
  const [registros, setRegistros] = useState<AuditoriaResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [toast, setToast] = useState<ToastInfo | null>(null);

  const [filtroTabla, setFiltroTabla] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError("");
      const params: { tabla?: string; fechaDesde?: string; fechaHasta?: string } = {};
      if (filtroTabla) params.tabla = filtroTabla;
      if (fechaDesde) params.fechaDesde = fechaDesde + "T00:00:00";
      if (fechaHasta) params.fechaHasta = fechaHasta + "T23:59:59";

      const data = await buscarAuditoria(params);
      setRegistros(data);
    } catch (err) {
      setLoadError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filtroTabla, fechaDesde, fechaHasta]);

  useEffect(() => {
    const t = setTimeout(cargarDatos);
    return () => clearTimeout(t);
  }, [cargarDatos]);

  function formatDate(iso: string): string {
    try {
      const d = new Date(iso);
      return d.toLocaleString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  }

  return (
    <div className="contenedor-pagina">
      <div className="container">
        <NotificationToast toast={toast} onClose={() => setToast(null)} />

        <PageHeader
          icon="bi-shield-lock"
          title="Auditoría Clínica"
          description="Historial de cambios sensibles en datos clínicos"
        />

        <div className="barra-filtros animacion-entrada">
          <div className="barra-filtros-grupo">
            <label>Módulo</label>
            <select
              className="campo-entrada"
              value={filtroTabla}
              onChange={(e) => setFiltroTabla(e.target.value)}
            >
              <option value="">Todos los módulos</option>
              {TABLAS_AUDITABLES.map((t) => (
                <option key={t} value={t}>
                  {TABLA_LABEL[t]}
                </option>
              ))}
            </select>
          </div>
          <div className="barra-filtros-grupo">
            <label>Desde</label>
            <input
              type="date"
              className="campo-entrada"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
            />
          </div>
          <div className="barra-filtros-grupo">
            <label>Hasta</label>
            <input
              type="date"
              className="campo-entrada"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
            />
          </div>
        </div>

        <div className="tarjeta animacion-entrada" style={{ animationDelay: "0.05s" }}>
          <div className="tarjeta-cuerpo">
            {loadError ? (
              <div className="dialogo-error" style={{ marginBottom: 0 }}>
                {loadError}
              </div>
            ) : loading ? (
              <div className="estado-cargando">
                <div
                  className="spinner-border"
                  style={{ color: "var(--color-primario)" }}
                  role="status"
                >
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : (
              <DataTable
                columns={[
                  "#",
                  "Fecha",
                  "Módulo",
                  "Registro",
                  "Operación",
                  "Campo",
                  "Valor Anterior",
                  "Valor Nuevo",
                  "Usuario",
                ]}
                emptyMessage="No hay registros de auditoría."
                colSpan={9}
              >
                {registros.map((reg, index) => (
                  <tr key={reg.id}>
                    <td>
                      <span className="numero-fila">{index + 1}</span>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>{formatDate(reg.fechaCambio)}</td>
                    <td>{TABLA_LABEL[reg.tablaAfectada as keyof typeof TABLA_LABEL] || reg.tablaAfectada}</td>
                    <td>#{reg.registroId}</td>
                    <td>
                      <span className={`etiqueta ${reg.tipoOperacion === "CREATE" ? "etiqueta--activo" : reg.tipoOperacion === "DELETE" ? "etiqueta--inactivo" : "bg-primary"}`}>
                        {OPERACION_LABEL[reg.tipoOperacion as keyof typeof OPERACION_LABEL] || reg.tipoOperacion}
                      </span>
                    </td>
                    <td>{reg.campo}</td>
                    <td style={{ maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis" }}>
                      {reg.valorAnterior || <span style={{ color: "var(--color-texto-claro)" }}>-</span>}
                    </td>
                    <td style={{ maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis" }}>
                      {reg.valorNuevo || <span style={{ color: "var(--color-texto-claro)" }}>-</span>}
                    </td>
                    <td>{reg.usuarioNombre || "-"}</td>
                  </tr>
                ))}
              </DataTable>
            )}
          </div>
          <div
            className="tarjeta-pie"
            style={{ fontSize: "var(--tamano-sm)", color: "var(--color-texto-claro)" }}
          >
            Total de registros: {registros.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditoriaPage;
