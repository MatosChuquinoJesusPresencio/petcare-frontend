import { useEffect, useState } from "react";
import type { HistorialVacunacionResponse } from "../../types";
import { VACUNACION_TIPO_LABEL } from "../../constants/vacunacionConstants";
import { listarVacunacionesPorMascota } from "../../services";
import DataTable from "../common/DataTable";

type Props = {
  mascotaId: number;
  onRefresh?: () => void;
};

const HistorialVacunacionTable = ({ mascotaId }: Props) => {
  const [registros, setRegistros] = useState<HistorialVacunacionResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!mascotaId) return;
    setLoading(true);
    listarVacunacionesPorMascota(mascotaId)
      .then(setRegistros)
      .catch(() => setRegistros([]))
      .finally(() => setLoading(false));
  }, [mascotaId]);

  if (loading) {
    return (
      <div className="estado-cargando py-3">
        <div className="spinner-border spinner-border-sm" style={{ color: "var(--color-primario)" }} role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <DataTable
      columns={["#", "Tipo", "Producto", "Fecha", "Proxima Dosis", "Veterinario", "Estado"]}
      emptyMessage="No hay registros de vacunacion o desparasitacion."
      colSpan={7}
    >
      {registros.map((r, i) => (
        <tr key={r.id}>
          <td><span className="numero-fila">{i + 1}</span></td>
          <td>
            <span className={`etiqueta ${r.tipo === "VACUNA" ? "etiqueta--activo" : "bg-primary"}`}>
              {VACUNACION_TIPO_LABEL[r.tipo as keyof typeof VACUNACION_TIPO_LABEL] || r.tipo}
            </span>
          </td>
          <td>{r.nombreProducto}</td>
          <td style={{ whiteSpace: "nowrap" }}>{r.fechaAplicacion}</td>
          <td style={{ whiteSpace: "nowrap" }}>{r.proximaDosis || <span style={{ color: "var(--color-texto-claro)" }}>-</span>}</td>
          <td>{r.veterinarioNombre}</td>
          <td>
            <span className={`etiqueta ${r.estado === "APLICADA" ? "etiqueta--activo" : r.estado === "PROGRAMADA" ? "bg-warning text-dark" : "etiqueta--inactivo"}`}>
              {r.estado}
            </span>
          </td>
        </tr>
      ))}
    </DataTable>
  );
};

export default HistorialVacunacionTable;
