import { useCallback, useEffect, useState } from "react";
import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/common/DataTable";
import NotificationToast from "../components/common/NotificationToast";
import type { ToastInfo } from "../components/common/NotificationToast";
import BaseFormDialog from "../components/common/BaseFormDialog";
import { consentimientoService } from "../services";
import { obtenerMascotas } from "../services/mascotaService";
import { obtenerVeterinarios } from "../services/usuarioService";
import { getDuenos } from "../services/clienteService";
import type { ConsentimientoResponse, MascotaResponse, VeterinarioResponse, Dueno } from "../types";
import { getErrorMessage } from "../utils/errorHandler";

const INITIAL_FORM = {
  mascotaId: "",
  duenoId: "",
  veterinarioId: "",
  tipoProcedimiento: "",
  descripcionProcedimiento: "",
  riesgosDescritos: "",
  alternativas: "",
  consentido: true,
  duenoNombreVerificado: "",
  testigoNombre: "",
  observaciones: "",
};

const ConsentimientosPage = () => {
  const [consentimientos, setConsentimientos] = useState<ConsentimientoResponse[]>([]);
  const [mascotas, setMascotas] = useState<MascotaResponse[]>([]);
  const [veterinarios, setVeterinarios] = useState<VeterinarioResponse[]>([]);
  const [duenos, setDuenos] = useState<Dueno[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [toast, setToast] = useState<ToastInfo | null>(null);
  const [filtroMascota, setFiltroMascota] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState(INITIAL_FORM);

  const cargarCombos = useCallback(async () => {
    try {
      const [m, v, d] = await Promise.all([
        obtenerMascotas(),
        obtenerVeterinarios(),
        getDuenos(),
      ]);
      setMascotas(m);
      setVeterinarios(v);
      setDuenos(d);
    } catch { /* ignore */ }
  }, []);

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError("");
      if (filtroMascota) {
        const data = await consentimientoService.listarPorMascota(Number(filtroMascota));
        setConsentimientos(data);
      } else {
        const data = await consentimientoService.listarTodos();
        setConsentimientos(data);
      }
    } catch (err) {
      setLoadError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filtroMascota]);

  useEffect(() => { cargarCombos(); }, [cargarCombos]);
  useEffect(() => { const t = setTimeout(cargarDatos); return () => clearTimeout(t); }, [cargarDatos]);

  function formatDate(iso: string): string {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch { return iso; }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.mascotaId || !form.duenoId || !form.veterinarioId || !form.tipoProcedimiento || !form.descripcionProcedimiento || !form.riesgosDescritos) {
      setToast({ message: "Complete los campos obligatorios", type: "error" });
      return;
    }
    setSaving(true);
    setSubmitError("");
    try {
      await consentimientoService.registrar({
        mascotaId: Number(form.mascotaId),
        duenoId: Number(form.duenoId),
        veterinarioId: Number(form.veterinarioId),
        tipoProcedimiento: form.tipoProcedimiento,
        descripcionProcedimiento: form.descripcionProcedimiento,
        riesgosDescritos: form.riesgosDescritos,
        alternativas: form.alternativas || undefined,
        consentido: form.consentido,
        duenoNombreVerificado: form.duenoNombreVerificado || undefined,
        testigoNombre: form.testigoNombre || undefined,
        observaciones: form.observaciones || undefined,
      });
      setToast({ message: "Consentimiento registrado correctamente", type: "success" });
      setShowModal(false);
      setForm(INITIAL_FORM);
      cargarDatos();
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="contenedor-pagina">
      <div className="container">
        <NotificationToast toast={toast} onClose={() => setToast(null)} />
        <PageHeader icon="bi-file-earmark-check" title="Consentimientos Informados" description="Registro de consentimientos de procedimientos veterinarios" />

        <div className="barra-filtros animacion-entrada">
          <div className="barra-filtros-grupo">
            <label>Mascota</label>
            <select className="campo-entrada" value={filtroMascota} onChange={(e) => setFiltroMascota(e.target.value)}>
              <option value="">Todas las mascotas</option>
              {mascotas.map((m) => (
                <option key={m.id} value={m.id}>{m.name} ({m.especie})</option>
              ))}
            </select>
          </div>
          <button className="boton boton-primario" onClick={() => { setForm(INITIAL_FORM); setShowModal(true); }}>
            <i className="bi bi-plus-lg me-1" /> Nuevo Consentimiento
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
              <DataTable columns={["#", "Fecha", "Procedimiento", "Veterinario", "Consentido", "Testigo", "Observaciones"]} emptyMessage="No hay consentimientos registrados." colSpan={7}>
                {consentimientos.map((c, i) => (
                  <tr key={c.id}>
                    <td><span className="numero-fila">{i + 1}</span></td>
                    <td style={{ whiteSpace: "nowrap" }}>{formatDate(c.fechaConsentimiento)}</td>
                    <td>{c.tipoProcedimiento}</td>
                    <td>{c.veterinarioNombre || "-"}</td>
                    <td>
                      <span className={`etiqueta ${c.consentido ? "etiqueta--activo" : "etiqueta--inactivo"}`}>
                        {c.consentido ? "Si" : "No"}
                      </span>
                    </td>
                    <td>{c.testigoNombre || "-"}</td>
                    <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.observaciones || "-"}</td>
                  </tr>
                ))}
              </DataTable>
            )}
          </div>
          <div className="tarjeta-pie" style={{ fontSize: "var(--tamano-sm)", color: "var(--color-texto-claro)" }}>
            Total: {consentimientos.length}
          </div>
        </div>
      </div>

      {/* Modal Nuevo Consentimiento */}
      <BaseFormDialog
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        title="Registrar Consentimiento"
        submitLabel="Registrar"
        submitBusyLabel="Guardando..."
        isSubmitting={saving}
        submitError={submitError}
        modalId="consentimiento-dialog"
      >
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Mascota *</label>
            <select className="form-select" name="mascotaId" value={form.mascotaId} onChange={handleChange} required>
              <option value="">Seleccionar...</option>
              {mascotas.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Dueno *</label>
            <select className="form-select" name="duenoId" value={form.duenoId} onChange={handleChange} required>
              <option value="">Seleccionar...</option>
              {duenos.map((d) => <option key={d.id} value={d.id}>{d.usuario?.names} {d.usuario?.lastNames}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Veterinario *</label>
            <select className="form-select" name="veterinarioId" value={form.veterinarioId} onChange={handleChange} required>
              <option value="">Seleccionar...</option>
              {veterinarios.map((v) => <option key={v.id} value={v.id}>{v.names} {v.lastNames}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Tipo de Procedimiento *</label>
            <input className="form-control" name="tipoProcedimiento" value={form.tipoProcedimiento} onChange={handleChange} required placeholder="Ej: Consulta general, Cirugia..." />
          </div>
          <div className="col-md-6">
            <label className="form-label">Nombre del Dueno Verificado</label>
            <input className="form-control" name="duenoNombreVerificado" value={form.duenoNombreVerificado} onChange={handleChange} placeholder="Nombre completo verificado" />
          </div>
          <div className="col-12">
            <label className="form-label">Descripcion del Procedimiento *</label>
            <textarea className="form-control" name="descripcionProcedimiento" rows={2} value={form.descripcionProcedimiento} onChange={handleChange} required placeholder="Describa el procedimiento..." />
          </div>
          <div className="col-12">
            <label className="form-label">Riesgos Descritos *</label>
            <textarea className="form-control" name="riesgosDescritos" rows={2} value={form.riesgosDescritos} onChange={handleChange} required placeholder="Describa los riesgos del procedimiento..." />
          </div>
          <div className="col-md-6">
            <label className="form-label">Alternativas</label>
            <input className="form-control" name="alternativas" value={form.alternativas} onChange={handleChange} placeholder="Alternativas al procedimiento" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Testigo</label>
            <input className="form-control" name="testigoNombre" value={form.testigoNombre} onChange={handleChange} placeholder="Nombre del testigo (opcional)" />
          </div>
          <div className="col-12">
            <label className="form-label">Observaciones</label>
            <textarea className="form-control" name="observaciones" rows={2} value={form.observaciones} onChange={handleChange} placeholder="Observaciones adicionales..." />
          </div>
          <div className="col-12">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" name="consentido" checked={form.consentido} onChange={handleChange} id="consentidoCheck" />
              <label className="form-check-label" htmlFor="consentidoCheck">El dueno ha dado su consentimiento</label>
            </div>
          </div>
        </div>
      </BaseFormDialog>
    </div>
  );
};

export default ConsentimientosPage;
