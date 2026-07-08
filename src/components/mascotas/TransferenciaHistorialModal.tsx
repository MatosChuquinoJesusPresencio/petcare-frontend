import { useEffect, useState } from "react";

import DataTable from "../common/DataTable";

import type { HistorialTransferenciaResponse } from "../../types";

import { obtenerTransferenciasPorMascota } from "../../services";

interface Props {
  show: boolean;
  mascotaId: number | null;
  onClose: () => void;
}

export default function TransferenciaHistorialModal({ show, mascotaId, onClose }: Props) {
  const [transferencias, setTransferencias] = useState<HistorialTransferenciaResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!show || !mascotaId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await obtenerTransferenciasPorMascota(mascotaId);
        if (!cancelled) setTransferencias(data);
      } catch {
        if (!cancelled) setTransferencias([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [show, mascotaId]);

  if (!show) return null;

  return (
    <>
      <div className="dialogo-fondo" onClick={onClose}></div>
      <div className="dialogo-contenedor" aria-hidden="false" aria-modal="true" role="dialog">
        <div className="dialogo-ventana dialogo-ventana--grande">
          <div className="dialogo-encabezado">
            <h5 className="dialogo-titulo">
              <i className="bi bi-clock-history me-2"></i>
              Historial de Transferencias
            </h5>
            <button type="button" className="dialogo-cerrar" aria-label="Cerrar" onClick={onClose}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          <div className="dialogo-cuerpo">
            {loading ? (
              <div className="estado-cargando">
                <div className="spinner-border" style={{ color: 'var(--color-primario)' }} role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : (
              <DataTable
                columns={["#", "Fecha", "Dueño Anterior ID", "Dueño Nuevo ID", "Motivo"]}
                emptyMessage="No hay historial de transferencias para esta mascota."
                colSpan={5}
              >
                {transferencias.map((t, i) => (
                  <tr key={t.id}>
                    <td><span className="numero-fila">{i + 1}</span></td>
                    <td>{new Date(t.date).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                    <td>{t.previousOwnerId ?? <span style={{ color: 'var(--color-texto-claro)', fontStyle: 'italic' }}>—</span>}</td>
                    <td>{t.newOwnerId}</td>
                    <td>{t.reason}</td>
                  </tr>
                ))}
              </DataTable>
            )}
          </div>
          <div className="dialogo-pie">
            <button type="button" className="boton boton--neutro" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </>
  );
}
