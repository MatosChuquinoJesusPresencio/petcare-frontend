import { useCallback, useEffect, useState } from "react";

import { useAuth } from "../hooks/useAuth";
import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/common/DataTable";
import BaseFormDialog from "../components/common/BaseFormDialog";
import NotificationToast from "../components/common/NotificationToast";
import type { ToastInfo } from "../components/common/NotificationToast";

import { SALA_ESPERA_ESTADO_LABEL } from "../constants";
import type { CitaResponse, SalaEsperaResponse } from "../types";
import { cambiarEstadoSalaEspera, obtenerCitas, obtenerSalaEspera, registrarLlegada } from "../services";
import { getErrorMessage } from "../utils/errorHandler";

function badgeClass(status: string): string {
  const map: Record<string, string> = {
    PENDIENTE: 'etiqueta--pendiente',
    EN_ATENCION: 'etiqueta--en_atencion',
    ATENDIDO: 'etiqueta--completado',
    REPROGRAMADO: 'etiqueta--reprogramada',
  };
  return map[status] || 'etiqueta--secundario';
}

const SalaEsperaPage = () => {
  const { user } = useAuth();
  const puedeGestionar = user?.role === 'ADMINISTRADOR' || user?.role === 'ASISTENTE';
  const [lista, setLista] = useState<SalaEsperaResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastInfo | null>(null);
  const [showRegistrar, setShowRegistrar] = useState(false);
  const [citas, setCitas] = useState<CitaResponse[]>([]);
  const [nuevoAppointmentId, setNuevoAppointmentId] = useState("");
  const [nuevoObservations, setNuevoObservations] = useState("");

  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      const data = await obtenerSalaEspera();
      setLista(data);
    } catch (err) {
      setToast({ message: getErrorMessage(err), type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(cargar);
    return () => clearTimeout(t);
  }, [cargar]);

  const cargarCitasDisponibles = useCallback(async () => {
    try {
      const [programadas, confirmadas, sala] = await Promise.all([
        obtenerCitas({ estado: "PROGRAMADA" }),
        obtenerCitas({ estado: "CONFIRMADA" }),
        obtenerSalaEspera(),
      ]);
      const enSala = new Set(sala.map((s) => s.appointmentId));
      setCitas([...programadas, ...confirmadas].filter((c) => !enSala.has(c.id)));
    } catch (err) {
      setToast({ message: getErrorMessage(err), type: "error" });
    }
  }, []);

  const handleRegistrarLlegada = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoAppointmentId) return;
    try {
      await registrarLlegada({ appointmentId: Number(nuevoAppointmentId), observations: nuevoObservations || undefined });
      setShowRegistrar(false);
      setNuevoAppointmentId("");
      setNuevoObservations("");
      await cargar();
      setToast({ message: "Llegada registrada correctamente.", type: "success" });
    } catch (err) {
      setToast({ message: getErrorMessage(err), type: "error" });
    }
  };

  const handleCambiarEstado = async (id: number, status: string) => {
    try {
      await cambiarEstadoSalaEspera(id, { status });
      await cargar();
      setToast({ message: "Estado actualizado correctamente.", type: "success" });
    } catch (err) {
      setToast({ message: getErrorMessage(err), type: "error" });
    }
  };

  const otrosEstados = (actual: string) => {
    if (actual === "PENDIENTE") return ["REPROGRAMADO"];
    return [];
  };

  return (
    <div className="contenedor-pagina">
      <div className="container">
        <NotificationToast toast={toast} onClose={() => setToast(null)} />
        <PageHeader icon="bi-door-open" title="Sala de Espera" description="Gestiona los pacientes en espera de atención">
          {puedeGestionar && (
            <button className="boton boton--primario me-2" onClick={() => { cargarCitasDisponibles(); setShowRegistrar(true); }}>
              <i className="bi bi-plus-circle-fill me-1"></i>Registrar Llegada
            </button>
          )}
          <button className="boton boton--neutro" onClick={cargar}>
            <i className="bi bi-arrow-clockwise me-1"></i>Actualizar
          </button>
        </PageHeader>

        <div className="tarjeta animacion-entrada">
          <div className="tarjeta-cuerpo">
            {loading ? (
              <div className="estado-cargando">
                <div className="spinner-border" style={{ color: 'var(--color-primario)' }} role="status" />
              </div>
            ) : (
              <DataTable
                columns={["#", "Mascota ID", "Cita ID", "Llegada", "Estado", "Observaciones", "Acciones"]}
                emptyMessage="No hay pacientes en sala de espera."
                colSpan={7}
              >
                {lista.map((item, i) => (
                  <tr key={item.id}>
                    <td><span className="numero-fila">{i + 1}</span></td>
                    <td>{item.petId}</td>
                    <td>{item.appointmentId}</td>
                    <td>{new Date(item.arrivalDate).toLocaleString()}</td>
                    <td>
                      <span className={`etiqueta ${badgeClass(item.status)}`}>
                        {SALA_ESPERA_ESTADO_LABEL[item.status as keyof typeof SALA_ESPERA_ESTADO_LABEL] || item.status}
                      </span>
                    </td>
                    <td>{item.observations || "—"}</td>
                    <td>
                      {puedeGestionar && (
                        <div className="acciones-tabla">
                          {otrosEstados(item.status).map((est) => (
                            <button
                              key={est}
                              className="boton boton--pequeno boton--borde"
                              onClick={() => handleCambiarEstado(item.id, est)}
                            >
                              {SALA_ESPERA_ESTADO_LABEL[est as keyof typeof SALA_ESPERA_ESTADO_LABEL]}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </DataTable>
            )}
          </div>
        </div>

        <BaseFormDialog
          isOpen={showRegistrar}
          onClose={() => setShowRegistrar(false)}
          onSubmit={handleRegistrarLlegada}
          title="Registrar Llegada"
          submitLabel="Registrar"
          isSubmitting={false}
          submitError=""
          modalId="registrarLlegadaModal"
          size="md"
        >
          <div className="campo-grupo">
            <label className="campo-etiqueta">Cita *</label>
            <select className="campo-entrada" value={nuevoAppointmentId} onChange={(e) => setNuevoAppointmentId(e.target.value)} required>
              <option value="">Seleccione una cita</option>
              {citas.map((c) => (
                <option key={c.id} value={c.id}>
                  #{c.id} - {new Date(c.dateTime).toLocaleString("es-PE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })} - {c.status}
                </option>
              ))}
            </select>
          </div>
          <div className="campo-grupo">
            <label className="campo-etiqueta">Observaciones</label>
            <textarea className="campo-entrada" rows={2} value={nuevoObservations} onChange={(e) => setNuevoObservations(e.target.value)} />
          </div>
        </BaseFormDialog>
      </div>
    </div>
  );
};

export default SalaEsperaPage;
