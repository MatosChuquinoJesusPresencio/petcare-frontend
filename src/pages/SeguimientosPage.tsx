import { useCallback, useEffect, useState } from "react";
import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/common/DataTable";
import ConfirmDialog from "../components/common/ConfirmDialog";
import BaseFormDialog from "../components/common/BaseFormDialog";
import NotificationToast from "../components/common/NotificationToast";
import type { ToastInfo } from "../components/common/NotificationToast";
import { seguimientoService } from "../services";
import { obtenerMascotas } from "../services/mascotaService";
import { obtenerVeterinarios } from "../services/usuarioService";
import { obtenerAtencionesPorMascota } from "../services/atencionService";
import type { SeguimientoResponse, MascotaResponse, VeterinarioResponse, AtencionClinicaResponse } from "../types";
import { getErrorMessage } from "../utils/errorHandler";

const INITIAL_FORM = {
  mascotaId: "",
  atencionClinicaId: "",
  veterinarioId: "",
  tipo: "PRESENCIAL",
  fechaProgramada: "",
  motivo: "",
};

const SeguimientosPage = () => {
  const [seguimientos, setSeguimientos] = useState<SeguimientoResponse[]>([]);
  const [mascotas, setMascotas] = useState<MascotaResponse[]>([]);
  const [veterinarios, setVeterinarios] = useState<VeterinarioResponse[]>([]);
  const [atenciones, setAtenciones] = useState<AtencionClinicaResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [toast, setToast] = useState<ToastInfo | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState(INITIAL_FORM);
  const [cancelarId, setCancelarId] = useState<number | null>(null);
  const [completarId, setCompletarId] = useState<number | null>(null);
  const [resultado, setResultado] = useState("");
  const [completarSubmitting, setCompletarSubmitting] = useState(false);
  const [completarError, setCompletarError] = useState("");

  const cargarCombos = useCallback(async () => {
    try {
      const [m, v] = await Promise.all([obtenerMascotas(), obtenerVeterinarios()]);
      setMascotas(m);
      setVeterinarios(v);
    } catch { /* ignore */ }
  }, []);

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError("");
      const data = await seguimientoService.proximos();
      setSeguimientos(data);
    } catch (err) {
      setLoadError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargarCombos(); }, [cargarCombos]);
  useEffect(() => { const t = setTimeout(cargarDatos); return () => clearTimeout(t); }, [cargarDatos]);

  function formatDate(iso: string): string {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch { return iso; }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "mascotaId" && value) {
      setAtenciones([]);
      setForm((prev) => ({ ...prev, mascotaId: value, atencionClinicaId: "" }));
      obtenerAtencionesPorMascota(Number(value)).then(setAtenciones).catch(() => setAtenciones([]));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.atencionClinicaId || !form.veterinarioId || !form.fechaProgramada || !form.motivo) {
      setToast({ message: "Complete los campos obligatorios", type: "error" });
      return;
    }
    setSaving(true);
    setSubmitError("");
    try {
      await seguimientoService.programar(Number(form.atencionClinicaId), {
        veterinarioId: Number(form.veterinarioId),
        tipo: form.tipo,
        fechaProgramada: form.fechaProgramada,
        motivo: form.motivo,
      });
      setToast({ message: "Seguimiento programado correctamente", type: "success" });
      setShowModal(false);
      setForm(INITIAL_FORM);
      cargarDatos();
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  const handleCompletarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (completarId === null) return;
    try {
      setCompletarSubmitting(true);
      setCompletarError("");
      await seguimientoService.completar(completarId, resultado || undefined);
      setToast({ message: "Seguimiento completado", type: "success" });
      setCompletarId(null);
      setResultado("");
      cargarDatos();
    } catch (err) {
      setCompletarError(getErrorMessage(err));
    } finally {
      setCompletarSubmitting(false);
    }
  };

  const handleCancelarConfirmado = async () => {
    if (cancelarId === null) return;
    try {
      await seguimientoService.cancelar(cancelarId);
      setToast({ message: "Seguimiento cancelado", type: "success" });
      setCancelarId(null);
      cargarDatos();
    } catch (err) {
      setToast({ message: getErrorMessage(err), type: "error" });
    }
  };

  return (
    <div className="contenedor-pagina">
      <div className="container">
        <NotificationToast toast={toast} onClose={() => setToast(null)} />
        <PageHeader icon="bi-clipboard-check" title="Seguimientos Post-Consulta" description="Seguimientos programados para pacientes" />

        <div className="barra-filtros animacion-entrada">
          <div />
          <button className="boton boton-primario" onClick={() => { setForm(INITIAL_FORM); setAtenciones([]); setShowModal(true); }}>
            <i className="bi bi-plus-lg me-1" /> Programar Seguimiento
          </button>
        </div>

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
              <DataTable columns={["#", "Fecha Programada", "Mascota", "Veterinario", "Tipo", "Motivo", "Estado", "Acciones"]} emptyMessage="No hay seguimientos programados." colSpan={8}>
                {seguimientos.map((s, i) => (
                  <tr key={s.id}>
                    <td><span className="numero-fila">{i + 1}</span></td>
                    <td style={{ whiteSpace: "nowrap" }}>{formatDate(s.fechaProgramada)}</td>
                    <td>{s.mascotaNombre || "-"}</td>
                    <td>{s.veterinarioNombre || "-"}</td>
                    <td><span className={`etiqueta ${s.tipo === "TELEFONICO" ? "bg-info" : "bg-secondary"}`}>{s.tipo}</span></td>
                    <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.motivo}</td>
                    <td>
                      <span className={`etiqueta ${s.estado === "PROGRAMADO" ? "etiqueta--activo" : s.estado === "COMPLETADO" ? "bg-success" : "etiqueta--inactivo"}`}>
                        {s.estado}
                      </span>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {s.estado === "PROGRAMADO" && (
                        <>
                          <button className="btn btn-sm btn-success me-1" onClick={() => setCompletarId(s.id)}>
                            <i className="bi bi-check-lg" /> Completar
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => setCancelarId(s.id)}>
                            <i className="bi bi-x-lg" /> Cancelar
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </DataTable>
            )}
          </div>
          <div className="tarjeta-pie" style={{ fontSize: "var(--tamano-sm)", color: "var(--color-texto-claro)" }}>
            Total: {seguimientos.length}
          </div>
        </div>
      </div>

      {/* Modal Programar Seguimiento */}
      <BaseFormDialog
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        title="Programar Seguimiento"
        submitLabel="Programar"
        submitBusyLabel="Guardando..."
        isSubmitting={saving}
        submitError={submitError}
        modalId="seguimiento-dialog"
      >
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label">Mascota *</label>
            <select className="form-select" name="mascotaId" value={form.mascotaId} onChange={handleChange} required>
              <option value="">Seleccionar mascota...</option>
              {mascotas.map((m) => <option key={m.id} value={m.id}>{m.name} ({m.especie})</option>)}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label">Atencion Clinica *</label>
            <select className="form-select" name="atencionClinicaId" value={form.atencionClinicaId} onChange={handleChange} required disabled={!form.mascotaId}>
              <option value="">
                {form.mascotaId ? "Seleccionar atencion..." : "Primero seleccione una mascota"}
              </option>
              {atenciones.map((a) => (
                <option key={a.id} value={a.id}>
                  #{a.id} - {a.diagnosis} ({formatDate(a.createdAt)})
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Veterinario *</label>
            <select className="form-select" name="veterinarioId" value={form.veterinarioId} onChange={handleChange} required>
              <option value="">Seleccionar...</option>
              {veterinarios.map((v) => <option key={v.id} value={v.id}>{v.names} {v.lastNames}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Tipo *</label>
            <select className="form-select" name="tipo" value={form.tipo} onChange={handleChange} required>
              <option value="PRESENCIAL">Presencial</option>
              <option value="TELEFONICO">Telefonico</option>
            </select>
          </div>
          <div className="col-12">
            <label className="form-label">Fecha y Hora Programada *</label>
            <input className="form-control" type="datetime-local" name="fechaProgramada" value={form.fechaProgramada} onChange={handleChange} required />
          </div>
          <div className="col-12">
            <label className="form-label">Motivo *</label>
            <textarea className="form-control" name="motivo" rows={3} value={form.motivo} onChange={handleChange} required placeholder="Motivo del seguimiento..." />
          </div>
        </div>
      </BaseFormDialog>

      {/* ConfirmDialog Cancelar */}
      <ConfirmDialog
        isOpen={cancelarId !== null}
        title="Cancelar seguimiento"
        message="¿Estás seguro de cancelar este seguimiento? Esta acción no se puede deshacer."
        confirmText="Cancelar seguimiento"
        cancelText="Volver"
        variant="danger"
        onConfirm={handleCancelarConfirmado}
        onCancel={() => setCancelarId(null)}
      />

      {/* Dialog Completar con Resultado */}
      <BaseFormDialog
        isOpen={completarId !== null}
        onClose={() => { setCompletarId(null); setResultado(""); setCompletarError(""); }}
        onSubmit={handleCompletarSubmit}
        title="Completar Seguimiento"
        submitLabel="Completar"
        submitBusyLabel="Completando..."
        isSubmitting={completarSubmitting}
        submitError={completarError}
        modalId="completar-seguimiento-dialog"
        size="md"
      >
        <label className="form-label">Resultado del seguimiento (opcional)</label>
        <textarea
          className="form-control"
          rows={3}
          value={resultado}
          onChange={(e) => setResultado(e.target.value)}
          placeholder="Describa el resultado del seguimiento..."
        />
      </BaseFormDialog>
    </div>
  );
};

export default SeguimientosPage;
