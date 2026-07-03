import { useCallback, useEffect, useState } from "react";

import { useAuth } from "../hooks/useAuth";
import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/common/DataTable";
import BaseFormDialog from "../components/common/BaseFormDialog";
import NotificationToast from "../components/common/NotificationToast";
import type { ToastInfo } from "../components/common/NotificationToast";

import type { AtencionClinicaResponse, CitaResponse, TriajeResponse } from "../types";
import { crearAtencionClinica, obtenerAtencionesClinicas, obtenerCitas, obtenerTriajes } from "../services";

const AtencionPage = () => {
  const { user } = useAuth();
  const [atenciones, setAtenciones] = useState<AtencionClinicaResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [toast, setToast] = useState<ToastInfo | null>(null);
  const [citas, setCitas] = useState<CitaResponse[]>([]);
  const [triajes, setTriajes] = useState<TriajeResponse[]>([]);
  const [detalle, setDetalle] = useState<AtencionClinicaResponse | null>(null);
  const [submitError, setSubmitError] = useState("");

  const [appointmentId, setAppointmentId] = useState("");
  const [reasonForConsultation, setReasonForConsultation] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [clinicalObservations, setClinicalObservations] = useState("");

  const cargarCitas = useCallback(async () => {
    try {
      const [confirmadas, atendidas, atenciones, triajesData] = await Promise.all([
        obtenerCitas({ estado: "CONFIRMADA" }),
        obtenerCitas({ estado: "ATENDIDA" }),
        obtenerAtencionesClinicas(),
        obtenerTriajes(),
      ]);
      const conAtencion = new Set(atenciones.map((a) => a.appointmentId));
      setTriajes(triajesData);
      setCitas([...confirmadas, ...atendidas].filter((c) => !conAtencion.has(c.id)));
    } catch {
      setToast({ message: "No se pudieron cargar las citas.", type: "error" });
    }
  }, []);

  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      const data = await obtenerAtencionesClinicas();
      setAtenciones(data);
    } catch {
      setToast({ message: "No se pudieron cargar las atenciones clínicas.", type: "error" });
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

  const citaATriaje = new Map(triajes.map((t) => [t.appointmentId, t.id]));
  const citasConTriaje = citas.filter((c) => citaATriaje.has(c.id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const triajeId = citaATriaje.get(Number(appointmentId));
    if (!triajeId) {
      setToast({ message: "La cita seleccionada no tiene un triaje registrado.", type: "error" });
      return;
    }
    try {
      await crearAtencionClinica({
        appointmentId: Number(appointmentId),
        reasonForConsultation,
        symptoms: symptoms || undefined,
        diagnosis,
        treatment: treatment || undefined,
        clinicalObservations: clinicalObservations || undefined,
        triageId: triajeId,
      });
      setOpenModal(false);
      await cargar();
      setToast({ message: "Atención clínica registrada correctamente.", type: "success" });
    } catch {
      setToast({ message: "No se pudo registrar la atención clínica.", type: "error" });
    }
  };

  const limpiarModal = () => {
    setAppointmentId("");
    setReasonForConsultation("");
    setSymptoms("");
    setDiagnosis("");
    setTreatment("");
    setClinicalObservations("");
    setSubmitError("");
  };

  return (
    <div className="contenedor-pagina">
      <div className="container">
        <NotificationToast toast={toast} onClose={() => setToast(null)} />

        <PageHeader icon="bi-activity" title="Atención Clínica" description="Registro de consultas y diagnósticos">
          {user?.role === 'VETERINARIO' && (
            <button className="boton boton--primario" onClick={() => { limpiarModal(); setOpenModal(true); }}>
              <i className="bi bi-plus-circle-fill me-1"></i>Nueva Atención
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
                columns={["#", "Cita ID", "Mascota ID", "Veterinario ID", "Motivo", "Diagnóstico", "Tratamiento", "Fecha"]}
                emptyMessage="No hay registros de atención clínica."
                colSpan={8}
              >
                {atenciones.map((a, i) => (
                  <tr key={a.id}>
                    <td><span className="numero-fila">{i + 1}</span></td>
                    <td>
                      <button className="boton boton--texto" onClick={() => setDetalle(a)}>
                        #{a.appointmentId}
                      </button>
                    </td>
                    <td>{a.petId}</td>
                    <td>{a.veterinarianId}</td>
                    <td>{a.reasonForConsultation}</td>
                    <td>{a.diagnosis}</td>
                    <td>{a.treatment || "—"}</td>
                    <td>{new Date(a.createdAt).toLocaleDateString("es-PE")}</td>
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
          title="Nueva Atención Clínica"
          submitLabel="Guardar"
          submitBusyLabel="Guardando..."
          isSubmitting={false}
          submitError={submitError}
          modalId="atencionModal"
        >
          <div className="row g-3">
            <div className="col-md-6">
              <div className="campo-grupo">
                <label className="campo-etiqueta">Cita *</label>
                <select className="campo-entrada" value={appointmentId} onChange={(e) => setAppointmentId(e.target.value)} required>
                  <option value="">Seleccione una cita</option>
                  {citasConTriaje.map((c) => (
                    <option key={c.id} value={c.id}>
                      #{c.id} - {new Date(c.dateTime).toLocaleString("es-PE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })} - {c.status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="campo-grupo">
                <label className="campo-etiqueta">Motivo de Consulta *</label>
                <input type="text" className="campo-entrada" value={reasonForConsultation} onChange={(e) => setReasonForConsultation(e.target.value)} required />
              </div>
            </div>
            <div className="col-12">
              <div className="campo-grupo">
                <label className="campo-etiqueta">Diagnóstico *</label>
                <textarea className="campo-entrada" rows={2} value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} required />
              </div>
            </div>
            <div className="col-12">
              <div className="campo-grupo">
                <label className="campo-etiqueta">Síntomas</label>
                <textarea className="campo-entrada" rows={2} value={symptoms} onChange={(e) => setSymptoms(e.target.value)} />
              </div>
            </div>
            <div className="col-12">
              <div className="campo-grupo">
                <label className="campo-etiqueta">Tratamiento</label>
                <textarea className="campo-entrada" rows={2} value={treatment} onChange={(e) => setTreatment(e.target.value)} />
              </div>
            </div>
            <div className="col-12">
              <div className="campo-grupo">
                <label className="campo-etiqueta">Observaciones Clínicas</label>
                <textarea className="campo-entrada" rows={2} value={clinicalObservations} onChange={(e) => setClinicalObservations(e.target.value)} />
              </div>
            </div>
          </div>
        </BaseFormDialog>

        <BaseFormDialog
          isOpen={detalle !== null}
          onClose={() => setDetalle(null)}
          title="Detalle de Atención Clínica"
          submitLabel=""
          submitBusyLabel="—"
          isSubmitting={false}
          submitError=""
          modalId="detalleAtencionModal"
        >
          {detalle && (
            <div className="row g-3">
              <div className="col-md-6">
                <div className="campo-grupo">
                  <label className="campo-etiqueta">Cita ID</label>
                  <p className="texto-plano">#{detalle.appointmentId}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="campo-grupo">
                  <label className="campo-etiqueta">Mascota ID</label>
                  <p className="texto-plano">{detalle.petId}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="campo-grupo">
                  <label className="campo-etiqueta">Veterinario ID</label>
                  <p className="texto-plano">{detalle.veterinarianId}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="campo-grupo">
                  <label className="campo-etiqueta">Triaje ID</label>
                  <p className="texto-plano">{detalle.triageId ?? "—"}</p>
                </div>
              </div>
              <div className="col-12">
                <div className="campo-grupo">
                  <label className="campo-etiqueta">Motivo de Consulta</label>
                  <p className="texto-plano">{detalle.reasonForConsultation}</p>
                </div>
              </div>
              {detalle.symptoms && (
                <div className="col-12">
                  <div className="campo-grupo">
                    <label className="campo-etiqueta">Síntomas</label>
                    <p className="texto-plano">{detalle.symptoms}</p>
                  </div>
                </div>
              )}
              <div className="col-12">
                <div className="campo-grupo">
                  <label className="campo-etiqueta">Diagnóstico</label>
                  <p className="texto-plano">{detalle.diagnosis}</p>
                </div>
              </div>
              {detalle.treatment && (
                <div className="col-12">
                  <div className="campo-grupo">
                    <label className="campo-etiqueta">Tratamiento</label>
                    <p className="texto-plano">{detalle.treatment}</p>
                  </div>
                </div>
              )}
              {detalle.clinicalObservations && (
                <div className="col-12">
                  <div className="campo-grupo">
                    <label className="campo-etiqueta">Observaciones Clínicas</label>
                    <p className="texto-plano">{detalle.clinicalObservations}</p>
                  </div>
                </div>
              )}
              <div className="col-md-6">
                <div className="campo-grupo">
                  <label className="campo-etiqueta">Creado por</label>
                  <p className="texto-plano">{detalle.createdBy}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="campo-grupo">
                  <label className="campo-etiqueta">Fecha de creación</label>
                  <p className="texto-plano">{new Date(detalle.createdAt).toLocaleString("es-PE")}</p>
                </div>
              </div>
            </div>
          )}
        </BaseFormDialog>
      </div>
    </div>
  );
};

export default AtencionPage;
