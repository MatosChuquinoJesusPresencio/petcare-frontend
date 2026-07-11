import { useCallback, useEffect, useState } from "react";

import { useAuth } from "../hooks/useAuth";
import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/common/DataTable";
import BaseFormDialog from "../components/common/BaseFormDialog";
import NotificationToast from "../components/common/NotificationToast";
import type { ToastInfo } from "../components/common/NotificationToast";

import { NIVELES_URGENCIA, URGENCIA_LABEL } from "../constants";
import type { CitaResponse, TriajeResponse } from "../types";
import { crearTriaje, obtenerCitas, obtenerSalaEspera, obtenerTriajes } from "../services";
import { getErrorMessage } from "../utils/errorHandler";

function badgeUrgencia(nivel: string): string {
  const map: Record<string, string> = {
    RUTINARIA: 'etiqueta--secundario',
    PREFERENTE: 'etiqueta--advertencia',
    URGENTE: 'etiqueta--peligro',
    EMERGENCIA: 'etiqueta--danger',
  };
  return map[nivel] || '';
}

const TriajePage = () => {
  const { user } = useAuth();
  const [triajes, setTriajes] = useState<TriajeResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [toast, setToast] = useState<ToastInfo | null>(null);
  const [citas, setCitas] = useState<CitaResponse[]>([]);

  const [appointmentId, setAppointmentId] = useState("");
  const [reasonForVisit, setReasonForVisit] = useState("");
  const [urgencyLevel, setUrgencyLevel] = useState<string>(NIVELES_URGENCIA[0]);
  const [visibleSigns, setVisibleSigns] = useState("");
  const [observations, setObservations] = useState("");
  const [weight, setWeight] = useState("");
  const [temperature, setTemperature] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [respiratoryRate, setRespiratoryRate] = useState("");

  const cargarCitas = useCallback(async () => {
    try {
      const [programadas, confirmadas, sala, triajes] = await Promise.all([
        obtenerCitas({ estado: "PROGRAMADA" }),
        obtenerCitas({ estado: "CONFIRMADA" }),
        obtenerSalaEspera(),
        obtenerTriajes(),
      ]);
      const conTriaje = new Set(triajes.map((t) => t.appointmentId));
      const enSala = new Set(
        sala.filter((s) => s.status === "PENDIENTE" || s.status === "EN_ATENCION").map((s) => s.appointmentId)
      );
      setCitas([...programadas, ...confirmadas].filter((c) => enSala.has(c.id) && !conTriaje.has(c.id)));
    } catch (err) {
      setToast({ message: getErrorMessage(err), type: "error" });
    }
  }, []);

  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      const data = await obtenerTriajes();
      setTriajes(data);
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

  useEffect(() => {
    if (openModal) {
      const t = setTimeout(cargarCitas);
      return () => clearTimeout(t);
    }
  }, [openModal, cargarCitas]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await crearTriaje({
        appointmentId: Number(appointmentId),
        reasonForVisit,
        urgencyLevel,
        visibleSigns: visibleSigns || undefined,
        observations: observations || undefined,
        weight: weight ? Number(weight) : undefined,
        temperature: temperature ? Number(temperature) : undefined,
        heartRate: heartRate ? Number(heartRate) : undefined,
        respiratoryRate: respiratoryRate ? Number(respiratoryRate) : undefined,
      });
      setOpenModal(false);
      await cargar();
      setToast({ message: "Triaje registrado correctamente.", type: "success" });
    } catch (err) {
      setToast({ message: getErrorMessage(err), type: "error" });
    }
  };

  return (
    <div className="contenedor-pagina">
      <div className="container">
        <NotificationToast toast={toast} onClose={() => setToast(null)} />
        <PageHeader icon="bi-clipboard2-pulse" title="Triaje" description="Registro de evaluación inicial de pacientes">
          {(user?.role === 'VETERINARIO' || user?.role === 'ASISTENTE') && (
            <button className="boton boton--primario" onClick={() => setOpenModal(true)}>
              <i className="bi bi-plus-circle-fill me-1"></i>Nuevo Triaje
            </button>
          )}
        </PageHeader>

        <div className="tarjeta animacion-entrada">
          <div className="tarjeta-cuerpo">
            {loading ? (
              <div className="estado-cargando">
                <div className="spinner-border" style={{ color: 'var(--color-primario)' }} role="status" />
              </div>
            ) : (
              <DataTable
                columns={["#", "Cita ID", "Motivo", "Urgencia", "Peso", "Temp.", "FC", "FR", "Observaciones"]}
                emptyMessage="No hay registros de triaje."
                colSpan={9}
              >
                {triajes.map((t, i) => (
                  <tr key={t.id}>
                    <td><span className="numero-fila">{i + 1}</span></td>
                    <td>{t.appointmentId}</td>
                    <td>{t.reasonForVisit}</td>
                    <td>
                      <span className={`etiqueta ${badgeUrgencia(t.urgencyLevel)}`}>
                        {URGENCIA_LABEL[t.urgencyLevel as keyof typeof URGENCIA_LABEL] || t.urgencyLevel}
                      </span>
                    </td>
                    <td>{t.weight ?? "—"}</td>
                    <td>{t.temperature ?? "—"}</td>
                    <td>{t.heartRate ?? "—"}</td>
                    <td>{t.respiratoryRate ?? "—"}</td>
                    <td>{t.observations || "—"}</td>
                  </tr>
                ))}
              </DataTable>
            )}
          </div>
        </div>

        <BaseFormDialog
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          onSubmit={handleSubmit}
          title="Nuevo Triaje"
          submitLabel="Guardar"
          submitBusyLabel="Guardando..."
          isSubmitting={false}
          submitError=""
          modalId="triajeModal"
        >
          <div className="row g-3">
            <div className="col-md-6">
              <div className="campo-grupo">
                <label className="campo-etiqueta">Cita *</label>
                <select className="campo-entrada" value={appointmentId} onChange={(e) => setAppointmentId(e.target.value)} required>
                  <option value="">Seleccione una cita</option>
                  {citas.map((c) => (
                    <option key={c.id} value={c.id}>
                      #{c.id} - {new Date(c.dateTime).toLocaleString("es-PE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })} - {c.status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="campo-grupo">
                <label className="campo-etiqueta">Nivel de Urgencia *</label>
                <select className="campo-entrada" value={urgencyLevel} onChange={(e) => setUrgencyLevel(e.target.value)}>
                  {NIVELES_URGENCIA.map((n) => (
                    <option key={n} value={n}>{URGENCIA_LABEL[n]}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-12">
              <div className="campo-grupo">
                <label className="campo-etiqueta">Motivo de Visita *</label>
                <textarea className="campo-entrada" rows={2} value={reasonForVisit} onChange={(e) => setReasonForVisit(e.target.value)} required />
              </div>
            </div>
            <div className="col-12">
              <div className="campo-grupo">
                <label className="campo-etiqueta">Signos Visibles</label>
                <textarea className="campo-entrada" rows={2} value={visibleSigns} onChange={(e) => setVisibleSigns(e.target.value)} />
              </div>
            </div>
            <div className="col-md-3">
              <div className="campo-grupo">
                <label className="campo-etiqueta">Peso (kg)</label>
                <input type="number" step="0.01" className="campo-entrada" value={weight} onChange={(e) => setWeight(e.target.value)} />
              </div>
            </div>
            <div className="col-md-3">
              <div className="campo-grupo">
                <label className="campo-etiqueta">Temp. (°C)</label>
                <input type="number" step="0.1" className="campo-entrada" value={temperature} onChange={(e) => setTemperature(e.target.value)} />
              </div>
            </div>
            <div className="col-md-3">
              <div className="campo-grupo">
                <label className="campo-etiqueta">Frec. Cardíaca</label>
                <input type="number" className="campo-entrada" value={heartRate} onChange={(e) => setHeartRate(e.target.value)} />
              </div>
            </div>
            <div className="col-md-3">
              <div className="campo-grupo">
                <label className="campo-etiqueta">Frec. Respiratoria</label>
                <input type="number" className="campo-entrada" value={respiratoryRate} onChange={(e) => setRespiratoryRate(e.target.value)} />
              </div>
            </div>
            <div className="col-12">
              <div className="campo-grupo">
                <label className="campo-etiqueta">Observaciones</label>
                <textarea className="campo-entrada" rows={2} value={observations} onChange={(e) => setObservations(e.target.value)} />
              </div>
            </div>
          </div>
        </BaseFormDialog>
      </div>
    </div>
  );
};

export default TriajePage;
