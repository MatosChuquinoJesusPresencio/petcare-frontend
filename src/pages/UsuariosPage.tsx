import React, { useCallback, useEffect, useState } from "react";

import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/common/DataTable";
import BaseFormDialog from "../components/common/BaseFormDialog";
import NotificationToast from "../components/common/NotificationToast";
import type { ToastInfo } from "../components/common/NotificationToast";
import { getErrorMessage } from "../utils/errorHandler";
import { ROLES_USUARIO, ROL_LABEL } from "../constants";

import type { VeterinarioResponse, RegisterRequest } from "../types";
import {
  listarTodosUsuarios,
  crearUsuario,
  cambiarEstadoUsuario,
  actualizarUsuario,
} from "../services";

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState<VeterinarioResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastInfo | null>(null);

  const [filtroRol, setFiltroRol] = useState<string>("TODOS");

  const [showNuevo, setShowNuevo] = useState(false);
  const [nuevoForm, setNuevoForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "", role: "ASISTENTE" });
  const [nuevoFormErrors, setNuevoFormErrors] = useState<Record<string, string>>({});

  const [showEditar, setShowEditar] = useState<VeterinarioResponse | null>(null);
  const [editarForm, setEditarForm] = useState({ firstName: "", lastName: "", email: "", phone: "", role: "" });
  const [editarFormErrors, setEditarFormErrors] = useState<Record<string, string>>({});

  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listarTodosUsuarios();
      setUsuarios(data);
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

  const usuariosFiltrados = filtroRol === "TODOS"
    ? usuarios
    : usuarios.filter((u) => u.rol === filtroRol);

  const handleToggle = async (id: number, current: boolean) => {
    try {
      await cambiarEstadoUsuario(id, !current);
      await cargar();
      setToast({ message: `Usuario ${current ? "deshabilitado" : "habilitado"} correctamente.`, type: "success" });
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
      const data: RegisterRequest = { ...nuevoForm, role: nuevoForm.role };
      await crearUsuario(data);
      setShowNuevo(false);
      setNuevoForm({ firstName: "", lastName: "", email: "", phone: "", password: "", role: "ASISTENTE" });
      setNuevoFormErrors({});
      await cargar();
      setToast({ message: "Usuario creado correctamente.", type: "success" });
    } catch (err) {
      setToast({ message: getErrorMessage(err), type: "error" });
    }
  };

  const handleEditarClick = (u: VeterinarioResponse) => {
    setShowEditar(u);
    setEditarForm({
      firstName: u.names,
      lastName: u.lastNames,
      email: u.email ?? "",
      phone: u.phone ?? "",
      role: u.rol ?? "ASISTENTE",
    });
    setEditarFormErrors({});
  };

  const handleEditarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditar) return;
    const errors: Record<string, string> = {};
    if (!editarForm.firstName.trim()) errors.firstName = "El nombre es obligatorio.";
    if (!editarForm.lastName.trim()) errors.lastName = "El apellido es obligatorio.";
    if (!editarForm.email.trim()) errors.email = "El email es obligatorio.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editarForm.email.trim())) errors.email = "Email inválido.";
    if (editarForm.phone.trim() && !/^\d{9}$/.test(editarForm.phone.trim())) errors.phone = "El teléfono debe tener exactamente 9 dígitos.";
    if (Object.keys(errors).length > 0) { setEditarFormErrors(errors); return; }
    setEditarFormErrors({});
    try {
      await actualizarUsuario(showEditar.id, {
        firstName: editarForm.firstName,
        lastName: editarForm.lastName,
        email: editarForm.email,
        phone: editarForm.phone,
        role: editarForm.role,
      });
      setShowEditar(null);
      await cargar();
      setToast({ message: "Usuario actualizado correctamente.", type: "success" });
    } catch (err) {
      setToast({ message: getErrorMessage(err), type: "error" });
    }
  };

  return (
    <div className="contenedor-pagina">
      <div className="container">
        <NotificationToast toast={toast} onClose={() => setToast(null)} />

        <PageHeader icon="bi-people-fill" title="Usuarios" description="Gestión de todos los usuarios del sistema">
          <button className="boton boton--primario me-2" onClick={() => setShowNuevo(true)}>
            <i className="bi bi-plus-circle-fill me-1"></i>Nuevo Usuario
          </button>
          <button className="boton boton--neutro" onClick={cargar}>
            <i className="bi bi-arrow-clockwise me-1"></i>Actualizar
          </button>
        </PageHeader>

        <div className="tarjeta animacion-entrada">
          <div className="tarjeta-cuerpo">
            <div style={{ marginBottom: "var(--espaciado-md)", display: "flex", gap: "var(--espaciado-sm)", flexWrap: "wrap" }}>
              <button
                className={`boton boton--pequeno ${filtroRol === "TODOS" ? "boton--primario" : "boton--borde"}`}
                onClick={() => setFiltroRol("TODOS")}
              >
                Todos ({usuarios.length})
              </button>
              {ROLES_USUARIO.filter((r) => r !== "DUENO").map((rol) => (
                <button
                  key={rol}
                  className={`boton boton--pequeno ${filtroRol === rol ? "boton--primario" : "boton--borde"}`}
                  onClick={() => setFiltroRol(rol)}
                >
                  {ROL_LABEL[rol]} ({usuarios.filter((u) => u.rol === rol).length})
                </button>
              ))}
            </div>

            {loading ? (
              <div className="estado-cargando">
                <div className="spinner-border" style={{ color: 'var(--color-primario)' }} role="status" />
              </div>
            ) : (
              <DataTable
                columns={["#", "Nombres", "Apellidos", "Email", "Teléfono", "Rol", "Estado", "Acciones"]}
                emptyMessage="No hay usuarios registrados."
                colSpan={8}
              >
                {usuariosFiltrados.map((u, i) => (
                  <tr key={u.id}>
                    <td><span className="numero-fila">{i + 1}</span></td>
                    <td>{u.names}</td>
                    <td>{u.lastNames}</td>
                    <td>{u.email ?? "—"}</td>
                    <td>{u.phone ?? "—"}</td>
                    <td>
                      <span className="etiqueta etiqueta--info">
                        {ROL_LABEL[u.rol as keyof typeof ROL_LABEL] ?? u.rol}
                      </span>
                    </td>
                    <td>
                      <span className={`etiqueta ${u.active ? 'etiqueta--activo' : 'etiqueta--inactivo'}`}>
                        {u.active ? "Habilitado" : "Deshabilitado"}
                      </span>
                    </td>
                    <td>
                      <div className="acciones-tabla">
                        <button
                          className="boton boton--pequeno boton--borde"
                          onClick={() => handleEditarClick(u)}
                          title="Editar"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className={`boton boton--pequeno ${u.active ? 'boton--peligro' : 'boton--exito'}`}
                          onClick={() => handleToggle(u.id, !!u.active)}
                          title={u.active ? "Deshabilitar" : "Habilitar"}
                        >
                          {u.active ? "Deshabilitar" : "Habilitar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </DataTable>
            )}
          </div>
          <div className="tarjeta-pie" style={{ fontSize: 'var(--tamano-sm)', color: 'var(--color-texto-claro)' }}>
            Total de usuarios: {usuarios.length}
          </div>
        </div>

        <BaseFormDialog
          isOpen={showNuevo}
          onClose={() => setShowNuevo(false)}
          onSubmit={handleNuevoSubmit}
          title="Nuevo Usuario"
          submitLabel="Crear"
          isSubmitting={false}
          submitError=""
          modalId="nuevoUsuarioModal"
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
            <div className="col-md-6">
              <div className="campo-grupo">
                <label className="campo-etiqueta">Rol *</label>
                <select className="campo-entrada" value={nuevoForm.role} onChange={(e) => setNuevoForm((p) => ({ ...p, role: e.target.value }))} required>
                  {ROLES_USUARIO.filter((r) => r !== "DUENO").map((rol) => (
                    <option key={rol} value={rol}>{ROL_LABEL[rol]}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="campo-grupo">
                <label className="campo-etiqueta">Contraseña *</label>
                <input type="password" className={`campo-entrada ${nuevoFormErrors.password ? 'campo-entrada--error' : ''}`} value={nuevoForm.password} onChange={(e) => { setNuevoForm((p) => ({ ...p, password: e.target.value })); setNuevoFormErrors((p) => { const n = { ...p }; delete n.password; return n; }); }} required />
                {nuevoFormErrors.password && <div className="campo-error">{nuevoFormErrors.password}</div>}
              </div>
            </div>
          </div>
        </BaseFormDialog>

        <BaseFormDialog
          isOpen={showEditar !== null}
          onClose={() => setShowEditar(null)}
          onSubmit={handleEditarSubmit}
          title="Editar Usuario"
          submitLabel="Guardar"
          isSubmitting={false}
          submitError=""
          modalId="editarUsuarioModal"
          size="md"
        >
          <div className="row g-3">
            <div className="col-md-6">
              <div className="campo-grupo">
                <label className="campo-etiqueta">Nombres *</label>
                <input type="text" className={`campo-entrada ${editarFormErrors.firstName ? 'campo-entrada--error' : ''}`} value={editarForm.firstName} onChange={(e) => { setEditarForm((p) => ({ ...p, firstName: e.target.value })); setEditarFormErrors((p) => { const n = { ...p }; delete n.firstName; return n; }); }} required />
                {editarFormErrors.firstName && <div className="campo-error">{editarFormErrors.firstName}</div>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="campo-grupo">
                <label className="campo-etiqueta">Apellidos *</label>
                <input type="text" className={`campo-entrada ${editarFormErrors.lastName ? 'campo-entrada--error' : ''}`} value={editarForm.lastName} onChange={(e) => { setEditarForm((p) => ({ ...p, lastName: e.target.value })); setEditarFormErrors((p) => { const n = { ...p }; delete n.lastName; return n; }); }} required />
                {editarFormErrors.lastName && <div className="campo-error">{editarFormErrors.lastName}</div>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="campo-grupo">
                <label className="campo-etiqueta">Email *</label>
                <input type="email" className={`campo-entrada ${editarFormErrors.email ? 'campo-entrada--error' : ''}`} value={editarForm.email} onChange={(e) => { setEditarForm((p) => ({ ...p, email: e.target.value })); setEditarFormErrors((p) => { const n = { ...p }; delete n.email; return n; }); }} required />
                {editarFormErrors.email && <div className="campo-error">{editarFormErrors.email}</div>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="campo-grupo">
                <label className="campo-etiqueta">Teléfono</label>
                <input type="text" className={`campo-entrada ${editarFormErrors.phone ? 'campo-entrada--error' : ''}`} value={editarForm.phone} onChange={(e) => { setEditarForm((p) => ({ ...p, phone: e.target.value })); setEditarFormErrors((p) => { const n = { ...p }; delete n.phone; return n; }); }} />
                {editarFormErrors.phone && <div className="campo-error">{editarFormErrors.phone}</div>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="campo-grupo">
                <label className="campo-etiqueta">Rol *</label>
                <select className="campo-entrada" value={editarForm.role} onChange={(e) => setEditarForm((p) => ({ ...p, role: e.target.value }))} required>
                  {ROLES_USUARIO.filter((r) => r !== "DUENO").map((rol) => (
                    <option key={rol} value={rol}>{ROL_LABEL[rol]}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </BaseFormDialog>
      </div>
    </div>
  );
};

export default UsuariosPage;
