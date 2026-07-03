import React, { useCallback, useEffect, useState } from "react";

import { useAuth } from "../hooks/useAuth";
import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/common/DataTable";
import BaseFormDialog from "../components/common/BaseFormDialog";
import ConfirmDialog from "../components/common/ConfirmDialog";
import NotificationToast from "../components/common/NotificationToast";
import type { ToastInfo } from "../components/common/NotificationToast";

import type { DisponibilidadRequest, DisponibilidadVeterinarioResponse, RegisterRequest, VeterinarioResponse } from "../types";
import {
  cambiarEstadoUsuario,
  crearDisponibilidad,
  crearUsuario,
  eliminarDisponibilidad,
  obtenerDisponibilidadPorVeterinario,
  obtenerTodosVeterinarios,
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

  const [showDisponibilidad, setShowDisponibilidad] = useState<number | null>(null);
  const [disponibilidades, setDisponibilidades] = useState<Record<number, DisponibilidadVeterinarioResponse[]>>({});
  const [cargandoDisp, setCargandoDisp] = useState<Record<number, boolean>>({});

  const [showAddDisp, setShowAddDisp] = useState(false);
  const [addDispVetId, setAddDispVetId] = useState<number | null>(null);
  const [addDispForm, setAddDispForm] = useState({ dayOfWeek: 1, startTime: "08:00", endTime: "17:00" });

  const [deleteDispId, setDeleteDispId] = useState<number | null>(null);

  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      const data = await obtenerTodosVeterinarios();
      setVeterinarios(data);
    } catch {
      setToast({ message: "No se pudieron cargar los veterinarios.", type: "error" });
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
    } catch {
      setToast({ message: "No se pudo cambiar el estado.", type: "error" });
    }
  };

  const handleNuevoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data: RegisterRequest = { ...nuevoForm, role: "VETERINARIO" };
      await crearUsuario(data);
      setShowNuevo(false);
      setNuevoForm({ firstName: "", lastName: "", email: "", phone: "", password: "" });
      await cargar();
      setToast({ message: "Veterinario creado correctamente.", type: "success" });
    } catch {
      setToast({ message: "No se pudo crear el veterinario.", type: "error" });
    }
  };

  const toggleDisponibilidad = async (vetId: number) => {
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
      } catch {
        setToast({ message: "No se pudieron cargar los horarios.", type: "error" });
      } finally {
        setCargandoDisp((p) => ({ ...p, [vetId]: false }));
      }
    }
  };

  const handleAddDispSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (addDispVetId === null) return;
    try {
      const data: DisponibilidadRequest = { veterinarianId: addDispVetId, ...addDispForm };
      await crearDisponibilidad(data);
      setShowAddDisp(false);
      setAddDispForm({ dayOfWeek: 1, startTime: "08:00", endTime: "17:00" });
      const updated = await obtenerDisponibilidadPorVeterinario(addDispVetId);
      setDisponibilidades((p) => ({ ...p, [addDispVetId]: updated }));
      setToast({ message: "Horario agregado correctamente.", type: "success" });
    } catch {
      setToast({ message: "No se pudo agregar el horario.", type: "error" });
    }
  };

  const handleDeleteDisp = async () => {
    if (deleteDispId === null) return;
    try {
      await eliminarDisponibilidad(deleteDispId);
      setDeleteDispId(null);
      const vetId = showDisponibilidad;
      if (vetId !== null) {
        const updated = await obtenerDisponibilidadPorVeterinario(vetId);
        setDisponibilidades((p) => ({ ...p, [vetId]: updated }));
      }
      setToast({ message: "Horario eliminado correctamente.", type: "success" });
    } catch {
      setToast({ message: "No se pudo eliminar el horario.", type: "error" });
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
                          onClick={() => toggleDisponibilidad(v.id)}
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
                                    <th></th>
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
                                          <button className="boton boton--pequeno boton--peligro" onClick={() => setDeleteDispId(d.id)}>
                                            <i className="bi bi-trash"></i>
                                          </button>
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
                <input type="text" className="campo-entrada" value={nuevoForm.firstName} onChange={(e) => setNuevoForm((p) => ({ ...p, firstName: e.target.value }))} required />
              </div>
            </div>
            <div className="col-md-6">
              <div className="campo-grupo">
                <label className="campo-etiqueta">Apellidos *</label>
                <input type="text" className="campo-entrada" value={nuevoForm.lastName} onChange={(e) => setNuevoForm((p) => ({ ...p, lastName: e.target.value }))} required />
              </div>
            </div>
            <div className="col-md-6">
              <div className="campo-grupo">
                <label className="campo-etiqueta">Email *</label>
                <input type="email" className="campo-entrada" value={nuevoForm.email} onChange={(e) => setNuevoForm((p) => ({ ...p, email: e.target.value }))} required />
              </div>
            </div>
            <div className="col-md-6">
              <div className="campo-grupo">
                <label className="campo-etiqueta">Teléfono</label>
                <input type="text" className="campo-entrada" value={nuevoForm.phone} onChange={(e) => setNuevoForm((p) => ({ ...p, phone: e.target.value }))} />
              </div>
            </div>
            <div className="col-12">
              <div className="campo-grupo">
                <label className="campo-etiqueta">Contraseña *</label>
                <input type="password" className="campo-entrada" value={nuevoForm.password} onChange={(e) => setNuevoForm((p) => ({ ...p, password: e.target.value }))} required />
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

        <ConfirmDialog
          isOpen={deleteDispId !== null}
          title="Eliminar horario"
          message="¿Estás seguro de eliminar este horario de atención?"
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
