import React, { useCallback, useEffect, useState } from "react";

import { useAuth } from "../hooks/useAuth";
import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/common/DataTable";
import BaseFormDialog from "../components/common/BaseFormDialog";
import ConfirmDialog from "../components/common/ConfirmDialog";
import NotificationToast from "../components/common/NotificationToast";
import type { ToastInfo } from "../components/common/NotificationToast";
import { getErrorMessage } from "../utils/errorHandler";

import type { DisponibilidadRequest, DisponibilidadVeterinarioResponse, RegisterRequest, VeterinarioResponse } from "../types";
import {
  actualizarDisponibilidad,
  cambiarEstadoUsuario,
  crearDisponibilidad,
  crearUsuario,
  eliminarDisponibilidad,
  obtenerDisponibilidadPorVeterinario,
  obtenerTodosVeterinarios,
  toggleDisponibilidad as toggleActivoDisponibilidad,
} from "../services";

const DIAS_SEMANA = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const VeterinariosPage = () => {
  const { user } = useAuth();
  const puedeGestionar = user?.role === 'ADMINISTRADOR';
  const [veterinarios, setVeterinarios] = useState<VeterinarioResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastInfo | null>(null);

  const [showNuevo, setShowNuevo] = useState(false);
  const [nuevoForm, setNuevoForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "" });
  const [nuevoFormErrors, setNuevoFormErrors] = useState<Record<string, string>>({});

  const [showDisponibilidad, setShowDisponibilidad] = useState<number | null>(null);
  const [disponibilidades, setDisponibilidades] = useState<Record<number, DisponibilidadVeterinarioResponse[]>>({});
  const [cargandoDisp, setCargandoDisp] = useState<Record<number, boolean>>({});

  const [showAddDisp, setShowAddDisp] = useState(false);
  const [addDispVetId, setAddDispVetId] = useState<number | null>(null);
  const [addDispForm, setAddDispForm] = useState({ dayOfWeek: 1, startTime: "08:00", endTime: "17:00" });

  const [editDisp, setEditDisp] = useState<DisponibilidadVeterinarioResponse | null>(null);
  const [editDispForm, setEditDispForm] = useState({ dayOfWeek: 1, startTime: "08:00", endTime: "17:00" });

  const [deleteDispId, setDeleteDispId] = useState<number | null>(null);

  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      const data = await obtenerTodosVeterinarios();
      setVeterinarios(data);
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

  const handleToggle = async (id: number, current: boolean) => {
    try {
      await cambiarEstadoUsuario(id, !current);
      await cargar();
      setToast({ message: `Veterinario ${current ? "deshabilitado" : "habilitado"} correctamente.`, type: "success" });
    } catch (err) {
      setToast({ message: getErrorMessage(err), type: "error" });
    }
  };

  const handleNuevoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!nuevoForm.firstName.trim()) errors.firstName = "El nombre es obligatorio.";
    if (!nuevoForm.lastName.trim()) errors.lastName = "El apellido es obligatorio.";
    if (!nuevoForm.email.trim()) errors.email = "El email es obligatorio.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nuevoForm.email.trim())) errors.email = "Email inválido.";
    if (nuevoForm.phone.trim() && !/^\d{9}$/.test(nuevoForm.phone.trim())) errors.phone = "El teléfono debe tener exactamente 9 dígitos.";
    if (!nuevoForm.password) errors.password = "La contraseña es obligatoria.";
    else if (nuevoForm.password.length < 6) errors.password = "Mínimo 6 caracteres.";
    if (Object.keys(errors).length > 0) { setNuevoFormErrors(errors); return; }
    setNuevoFormErrors({});
    try {
      const data: RegisterRequest = { ...nuevoForm, role: "VETERINARIO" };
      await crearUsuario(data);
      setShowNuevo(false);
      setNuevoForm({ firstName: "", lastName: "", email: "", phone: "", password: "" });
      setNuevoFormErrors({});
      await cargar();
      setToast({ message: "Veterinario creado correctamente.", type: "success" });
    } catch (err) {
      setToast({ message: getErrorMessage(err), type: "error" });
    }
  };

  const toggleSeccionDisponibilidad = async (vetId: number) => {
    if (showDisponibilidad === vetId) {
      setShowDisponibilidad(null);
      return;
    }
    setShowDisponibilidad(vetId);
    if (!disponibilidades[vetId]) {
      setCargandoDisp((p) => ({ ...p, [vetId]: true }));
      try {
        const data = await obtenerDisponibilidadPorVeterinario(vetId);
        setDisponibilidades((p) => ({ ...p, [vetId]: data }));
      } catch (err) {
        setToast({ message: getErrorMessage(err), type: "error" });
      } finally {
        setCargandoDisp((p) => ({ ...p, [vetId]: false }));
      }
    }
  };

  const refrescarDisponibilidad = async (vetId: number) => {
    const updated = await obtenerDisponibilidadPorVeterinario(vetId);
    setDisponibilidades((p) => ({ ...p, [vetId]: updated }));
  };

  const handleAddDispSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (addDispVetId === null) return;
    try {
      const data: DisponibilidadRequest = { veterinarianId: addDispVetId, ...addDispForm };
      await crearDisponibilidad(data);
      setShowAddDisp(false);
      setAddDispForm({ dayOfWeek: 1, startTime: "08:00", endTime: "17:00" });
      await refrescarDisponibilidad(addDispVetId);
      setToast({ message: "Horario agregado correctamente.", type: "success" });
    } catch (err) {
      setToast({ message: getErrorMessage(err), type: "error" });
    }
  };

  const handleEditDisp = (d: DisponibilidadVeterinarioResponse) => {
    setEditDisp(d);
    setEditDispForm({ dayOfWeek: d.dayOfWeek, startTime: d.startTime.substring(0, 5), endTime: d.endTime.substring(0, 5) });
  };

  const handleEditDispSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDisp || showDisponibilidad === null) return;
    try {
      const data: DisponibilidadRequest = { veterinarianId: showDisponibilidad, ...editDispForm };
      await actualizarDisponibilidad(editDisp.id, data);
      setEditDisp(null);
      await refrescarDisponibilidad(showDisponibilidad);
      setToast({ message: "Horario actualizado correctamente.", type: "success" });
    } catch (err) {
      setToast({ message: getErrorMessage(err), type: "error" });
    }
  };

  const handleToggleDisp = async (d: DisponibilidadVeterinarioResponse) => {
    if (showDisponibilidad === null) return;
    try {
      await toggleActivoDisponibilidad(d.id);
      await refrescarDisponibilidad(showDisponibilidad);
      setToast({ message: `Horario ${d.active ? "deshabilitado" : "habilitado"} correctamente.`, type: "success" });
    } catch (err) {
      setToast({ message: getErrorMessage(err), type: "error" });
    }
  };

  const handleDeleteDisp = async () => {
    if (deleteDispId === null) return;
    try {
      await eliminarDisponibilidad(deleteDispId);
      setDeleteDispId(null);
      if (showDisponibilidad !== null) {
        await refrescarDisponibilidad(showDisponibilidad);
      }
      setToast({ message: "Horario eliminado correctamente.", type: "success" });
    } catch (err) {
      setToast({ message: getErrorMessage(err), type: "error" });
    }
  };

  return (
    <div className="contenedor-pagina">
      <div className="container">
        <NotificationToast toast={toast} onClose={() => setToast(null)} />

        <PageHeader icon="bi-person-badge" title="Veterinarios" description="Gestión de veterinarios del sistema">
          {puedeGestionar && (
            <button className="boton boton--primario me-2" onClick={() => setShowNuevo(true)}>
              <i className="bi bi-plus-circle-fill me-1"></i>Nuevo Veterinario
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
                columns={["#", "Nombres", "Apellidos", "Email", "Teléfono", "Estado", "Acciones", "Horarios"]}
                emptyMessage="No hay veterinarios registrados."
                colSpan={8}
              >
                {veterinarios.map((v, i) => (
                  <React.Fragment key={v.id}>
                    <tr>
                      <td><span className="numero-fila">{i + 1}</span></td>
                      <td>{v.names}</td>
                      <td>{v.lastNames}</td>
                      <td>{v.email ?? "—"}</td>
                      <td>{v.phone ?? "—"}</td>
                      <td>
                        <span className={`etiqueta ${v.active ? 'etiqueta--activo' : 'etiqueta--inactivo'}`}>
                          {v.active ? "Habilitado" : "Deshabilitado"}
                        </span>
                      </td>
                      <td>
                        {puedeGestionar && (
                          <button
                            className={`boton boton--pequeno ${v.active ? 'boton--peligro' : 'boton--exito'}`}
                            onClick={() => handleToggle(v.id, !!v.active)}
                          >
                            {v.active ? "Deshabilitar" : "Habilitar"}
                          </button>
                        )}
                      </td>
                      <td>
                        <button
                          className="boton boton--pequeno boton--borde"
                          onClick={() => toggleSeccionDisponibilidad(v.id)}
                        >
                          <i className={`bi ${showDisponibilidad === v.id ? 'bi-chevron-up' : 'bi-clock'} me-1`}></i>
                          {showDisponibilidad === v.id ? "Ocultar" : "Horarios"}
                        </button>
                      </td>
                    </tr>
                    {showDisponibilidad === v.id && (
                      <tr>
                        <td colSpan={8} style={{ padding: "0", background: "var(--color-fondo)" }}>
                          <div style={{ padding: "var(--espaciado-md)", borderBottom: "1px solid var(--color-borde)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--espaciado-sm)" }}>
                              <strong>Horarios de atención</strong>
                              {puedeGestionar && (
                                <button className="boton boton--pequeno boton--primario" onClick={() => { setAddDispVetId(v.id); setShowAddDisp(true); }}>
                                  <i className="bi bi-plus-circle me-1"></i>Agregar
                                </button>
                              )}
                            </div>
                            {cargandoDisp[v.id] ? (
                              <div className="estado-cargando" style={{ padding: "var(--espaciado-sm)" }}>
                                <div className="spinner-border spinner-border-sm" role="status" />
                              </div>
                            ) : disponibilidades[v.id]?.length ? (
                              <table className="tabla" style={{ margin: 0 }}>
                                <thead>
                                  <tr>
                                    <th>Día</th>
                                    <th>Inicio</th>
                                    <th>Fin</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {disponibilidades[v.id].map((d) => (
                                    <tr key={d.id}>
                                      <td>{DIAS_SEMANA[d.dayOfWeek] ?? d.dayOfWeek}</td>
                                      <td>{d.startTime.substring(0, 5)}</td>
                                      <td>{d.endTime.substring(0, 5)}</td>
                                      <td>
                                        <span className={`etiqueta ${d.active ? 'etiqueta--activo' : 'etiqueta--inactivo'}`}>
                                          {d.active ? "Activo" : "Inactivo"}
                                        </span>
                                      </td>
                                      <td>
                                        {puedeGestionar && (
                                          <div className="acciones-tabla">
                                            <button className="boton boton--pequeno boton--borde" onClick={() => handleEditDisp(d)} title="Editar">
                                              <i className="bi bi-pencil"></i>
                                            </button>
                                            <button
                                              className={`boton boton--pequeno ${d.active ? 'boton--peligro' : 'boton--exito'}`}
                                              onClick={() => handleToggleDisp(d)}
                                              title={d.active ? "Deshabilitar" : "Habilitar"}
                                            >
                                              <i className={`bi ${d.active ? 'bi-pause-circle' : 'bi-play-circle'}`}></i>
                                            </button>
                                            <button className="boton boton--pequeno boton--peligro" onClick={() => setDeleteDispId(d.id)} title="Eliminar">
                                              <i className="bi bi-trash"></i>
                                            </button>
                                          </div>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              <p style={{ color: "var(--color-texto-claro)", fontStyle: "italic", margin: 0 }}>
                                Sin horarios registrados.
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </DataTable>
            )}
          </div>
          <div className="tarjeta-pie" style={{ fontSize: 'var(--tamano-sm)', color: 'var(--color-texto-claro)' }}>
            Total de veterinarios: {veterinarios.length}
          </div>
        </div>

        <BaseFormDialog
          isOpen={showNuevo}
          onClose={() => setShowNuevo(false)}
          onSubmit={handleNuevoSubmit}
          title="Nuevo Veterinario"
          submitLabel="Crear"
          isSubmitting={false}
          submitError=""
          modalId="nuevoVetModal"
          size="md"
        >
          <div className="row g-3">
            <div className="col-md-6">
              <div className="campo-grupo">
                <label className="campo-etiqueta">Nombres *</label>
                <input type="text" className={`campo-entrada ${nuevoFormErrors.firstName ? 'campo-entrada--error' : ''}`} value={nuevoForm.firstName} onChange={(e) => { setNuevoForm((p) => ({ ...p, firstName: e.target.value })); setNuevoFormErrors((p) => { const n = { ...p }; delete n.firstName; return n; }); }} required />
                {nuevoFormErrors.firstName && <div className="campo-error">{nuevoFormErrors.firstName}</div>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="campo-grupo">
                <label className="campo-etiqueta">Apellidos *</label>
                <input type="text" className={`campo-entrada ${nuevoFormErrors.lastName ? 'campo-entrada--error' : ''}`} value={nuevoForm.lastName} onChange={(e) => { setNuevoForm((p) => ({ ...p, lastName: e.target.value })); setNuevoFormErrors((p) => { const n = { ...p }; delete n.lastName; return n; }); }} required />
                {nuevoFormErrors.lastName && <div className="campo-error">{nuevoFormErrors.lastName}</div>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="campo-grupo">
                <label className="campo-etiqueta">Email *</label>
                <input type="email" className={`campo-entrada ${nuevoFormErrors.email ? 'campo-entrada--error' : ''}`} value={nuevoForm.email} onChange={(e) => { setNuevoForm((p) => ({ ...p, email: e.target.value })); setNuevoFormErrors((p) => { const n = { ...p }; delete n.email; return n; }); }} required />
                {nuevoFormErrors.email && <div className="campo-error">{nuevoFormErrors.email}</div>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="campo-grupo">
                <label className="campo-etiqueta">Teléfono</label>
                <input type="text" className={`campo-entrada ${nuevoFormErrors.phone ? 'campo-entrada--error' : ''}`} value={nuevoForm.phone} onChange={(e) => { setNuevoForm((p) => ({ ...p, phone: e.target.value })); setNuevoFormErrors((p) => { const n = { ...p }; delete n.phone; return n; }); }} />
                {nuevoFormErrors.phone && <div className="campo-error">{nuevoFormErrors.phone}</div>}
              </div>
            </div>
            <div className="col-12">
              <div className="campo-grupo">
                <label className="campo-etiqueta">Contraseña *</label>
                <input type="password" className={`campo-entrada ${nuevoFormErrors.password ? 'campo-entrada--error' : ''}`} value={nuevoForm.password} onChange={(e) => { setNuevoForm((p) => ({ ...p, password: e.target.value })); setNuevoFormErrors((p) => { const n = { ...p }; delete n.password; return n; }); }} required />
                {nuevoFormErrors.password && <div className="campo-error">{nuevoFormErrors.password}</div>}
              </div>
            </div>
          </div>
        </BaseFormDialog>

        <BaseFormDialog
          isOpen={showAddDisp}
          onClose={() => setShowAddDisp(false)}
          onSubmit={handleAddDispSubmit}
          title="Agregar Horario"
          submitLabel="Agregar"
          isSubmitting={false}
          submitError=""
          modalId="addDispModal"
          size="md"
        >
          <div className="campo-grupo">
            <label className="campo-etiqueta">Día de la semana *</label>
            <select className="campo-entrada" value={addDispForm.dayOfWeek} onChange={(e) => setAddDispForm((p) => ({ ...p, dayOfWeek: Number(e.target.value) }))} required>
              {DIAS_SEMANA.slice(1).map((dia, idx) => (
                <option key={idx + 1} value={idx + 1}>{dia}</option>
              ))}
            </select>
          </div>
          <div className="row g-3">
            <div className="col-md-6">
              <div className="campo-grupo">
                <label className="campo-etiqueta">Hora inicio *</label>
                <input type="time" className="campo-entrada" value={addDispForm.startTime} onChange={(e) => setAddDispForm((p) => ({ ...p, startTime: e.target.value }))} required />
              </div>
            </div>
            <div className="col-md-6">
              <div className="campo-grupo">
                <label className="campo-etiqueta">Hora fin *</label>
                <input type="time" className="campo-entrada" value={addDispForm.endTime} onChange={(e) => setAddDispForm((p) => ({ ...p, endTime: e.target.value }))} required />
              </div>
            </div>
          </div>
        </BaseFormDialog>

        <BaseFormDialog
          isOpen={editDisp !== null}
          onClose={() => setEditDisp(null)}
          onSubmit={handleEditDispSubmit}
          title="Editar Horario"
          submitLabel="Actualizar"
          isSubmitting={false}
          submitError=""
          modalId="editDispModal"
          size="md"
        >
          <div className="campo-grupo">
            <label className="campo-etiqueta">Día de la semana *</label>
            <select className="campo-entrada" value={editDispForm.dayOfWeek} onChange={(e) => setEditDispForm((p) => ({ ...p, dayOfWeek: Number(e.target.value) }))} required>
              {DIAS_SEMANA.slice(1).map((dia, idx) => (
                <option key={idx + 1} value={idx + 1}>{dia}</option>
              ))}
            </select>
          </div>
          <div className="row g-3">
            <div className="col-md-6">
              <div className="campo-grupo">
                <label className="campo-etiqueta">Hora inicio *</label>
                <input type="time" className="campo-entrada" value={editDispForm.startTime} onChange={(e) => setEditDispForm((p) => ({ ...p, startTime: e.target.value }))} required />
              </div>
            </div>
            <div className="col-md-6">
              <div className="campo-grupo">
                <label className="campo-etiqueta">Hora fin *</label>
                <input type="time" className="campo-entrada" value={editDispForm.endTime} onChange={(e) => setEditDispForm((p) => ({ ...p, endTime: e.target.value }))} required />
              </div>
            </div>
          </div>
        </BaseFormDialog>

        <ConfirmDialog
          isOpen={deleteDispId !== null}
          title="Eliminar horario"
          message="¿Estás seguro de eliminar este horario de atención? Esta acción no se puede deshacer."
          confirmText="Eliminar"
          cancelText="Cancelar"
          variant="danger"
          onConfirm={handleDeleteDisp}
          onCancel={() => setDeleteDispId(null)}
        />
      </div>
    </div>
  );
};

export default VeterinariosPage;
