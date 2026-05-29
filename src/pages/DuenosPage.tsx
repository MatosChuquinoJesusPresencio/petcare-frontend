import { useEffect, useState } from "react";

import ActionButtons from "../components/common/ActionButtons";

import ConfirmDialog from "../components/common/ConfirmDialog";

import ContactoFormDialog from "../components/duenos/ContactoFormDialog";

import DataTable from "../components/common/DataTable";

import DuenoFormDialog from "../components/duenos/DuenoFormDialog";

import NotificationToast from "../components/common/NotificationToast";
import type { ToastInfo } from "../components/common/NotificationToast";

import PageHeader from "../components/common/PageHeader";

import {
  createContacto,
  createDueno,
  deleteContacto,
  deleteDueno,
  getContactosByDuenoId,
  getDuenos,
  toggleDueno,
  updateDueno,
} from "../services";

import type {
  ContactoEmergencia,
  ContactoEmergenciaRequest,
  Dueno,
  DuenoRequest,
} from "../types";

const DuenosPage = () => {
  const [duenos, setDuenos] = useState<Dueno[]>([]);
  const [selectedDueno, setSelectedDueno] = useState<Dueno | null>(null);
  const [openDuenoModal, setOpenDuenoModal] = useState(false);

  const [contactos, setContactos] = useState<ContactoEmergencia[]>([]);
  const [openContactoModal, setOpenContactoModal] = useState(false);
  const [searchContactoNombre, setSearchContactoNombre] = useState("");
  const [searchContactoTelefono, setSearchContactoTelefono] = useState("");
  const [searchContactoRelacion, setSearchContactoRelacion] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [filtroActivo, setFiltroActivo] = useState<string>("todos");
  const [searchNombre, setSearchNombre] = useState("");
  const [searchDni, setSearchDni] = useState("");

  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [confirmDeleteContacto, setConfirmDeleteContacto] = useState<number | null>(null);
  const [toast, setToast] = useState<ToastInfo | null>(null);

  async function cargarDuenos() {
    try {
      setLoading(true);
      setLoadError("");
      const params: { soloActivos?: boolean; nombre?: string; dni?: string } = {};

      if (filtroActivo === "activos") {
        params.soloActivos = true;
      } else if (filtroActivo === "inactivos") {
        params.soloActivos = false;
      }

      if (searchNombre.trim()) {
        params.nombre = searchNombre.trim();
      }

      if (searchDni.trim()) {
        params.dni = searchDni.trim();
      }

      const data = await getDuenos(params);
      setDuenos(data);
    } catch (error) {
      console.error("Error al cargar dueños:", error);
      setLoadError("No se pudieron cargar los registros de dueños.");
    } finally {
      setLoading(false);
    }
  }

  async function cargarContactos(duenoId: number) {
    try {
      const params: { nombre?: string; telefono?: string; relacion?: string } = {};
      if (searchContactoNombre.trim()) params.nombre = searchContactoNombre.trim();
      if (searchContactoTelefono.trim()) params.telefono = searchContactoTelefono.trim();
      if (searchContactoRelacion.trim()) params.relacion = searchContactoRelacion.trim();
      const data = await getContactosByDuenoId(duenoId, params);
      setContactos(data);
    } catch (error) {
      console.error("Error al cargar contactos de emergencia:", error);
      setToast({ message: "No se pudieron cargar los contactos de emergencia.", type: "error" });
    }
  }

  useEffect(() => {
    const timer = setTimeout(cargarDuenos);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroActivo, searchNombre, searchDni]);

  useEffect(() => {
    if (!selectedDueno) {
      const t = setTimeout(() => setContactos([]));
      return () => clearTimeout(t);
    }
    const timer = setTimeout(() => {
      cargarContactos(selectedDueno.id);
    });
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDueno, searchContactoNombre, searchContactoTelefono, searchContactoRelacion]);

  async function handleSaveDueno(data: DuenoRequest) {
    if (selectedDueno) {
      const duenoEditado = await updateDueno(selectedDueno.id, data);
      if (selectedDueno.id === duenoEditado.id) {
        setSelectedDueno(duenoEditado);
      }
    } else {
      await createDueno(data);
    }

    await cargarDuenos();
    setOpenDuenoModal(false);
    setToast({ message: "Dueño guardado correctamente.", type: "success" });
  }

  async function handleToggleDueno(id: number) {
    try {
      await toggleDueno(id);
      await cargarDuenos();
      setToast({ message: "Estado del dueño actualizado correctamente.", type: "success" });
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      setToast({ message: "No se pudo cambiar el estado del dueño.", type: "error" });
    }
  }

  async function handleDeleteConfirmed() {
    if (confirmDelete === null) return;

    try {
      await deleteDueno(confirmDelete);
      if (selectedDueno?.id === confirmDelete) {
        setSelectedDueno(null);
      }
      await cargarDuenos();
      setToast({ message: "Dueño eliminado correctamente.", type: "success" });
    } catch (error) {
      console.error("Error al eliminar dueño:", error);
      setToast({ message: "No se pudo eliminar el dueño.", type: "error" });
    } finally {
      setConfirmDelete(null);
    }
  }

  function handleOpenCreateDuenoModal() {
    setSelectedDueno(null);
    setOpenDuenoModal(true);
  }

  function handleOpenEditDuenoModal(dueno: Dueno) {
    setSelectedDueno(dueno);
    setOpenDuenoModal(true);
  }

  function handleCloseDuenoModal() {
    setOpenDuenoModal(false);
  }

  async function handleSaveContacto(data: ContactoEmergenciaRequest) {
    if (!selectedDueno) return;
    await createContacto(selectedDueno.id, data);
    await cargarContactos(selectedDueno.id);
    setOpenContactoModal(false);
    setToast({ message: "Contacto de emergencia creado correctamente.", type: "success" });
  }

  async function handleDeleteContacto(id: number) {
    try {
      await deleteContacto(id);
      if (selectedDueno) {
        await cargarContactos(selectedDueno.id);
      }
      setToast({ message: "Contacto de emergencia eliminado correctamente.", type: "success" });
    } catch (error) {
      console.error("Error al eliminar contacto:", error);
      setToast({ message: "No se pudo eliminar el contacto de emergencia.", type: "error" });
    } finally {
      setConfirmDeleteContacto(null);
    }
  }

  function mapDuenoToRequest(dueno: Dueno): DuenoRequest {
    return {
      firstName: dueno.nombre,
      lastName: dueno.apellido,
      dni: dueno.dni,
      email: dueno.email,
      phone: dueno.telefono,
      address: dueno.direccion,
      userId: dueno.usuario?.id ?? null,
    };
  }

  return (
    <div className="container mt-4">
      <NotificationToast toast={toast} onClose={() => setToast(null)} />
      <PageHeader icon="bi-people-fill" title="Dueños de Mascotas" description="Vista donde podrás revisar y gestionar los dueños y sus contactos">
        <button
          className="btn btn-success"
          onClick={handleOpenCreateDuenoModal}
        >
          <i className="bi bi-plus-circle-fill"></i> Nuevo Dueño
        </button>
      </PageHeader>

      <p className="text-muted small mb-1">
        <i className="bi bi-info-circle me-1"></i>
        Selecciona una fila para administrar sus contactos de emergencia
      </p>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex flex-wrap gap-2 align-items-center border-bottom pb-3 mb-3">
            <input
              type="text"
              className="form-control w-auto"
              placeholder="Buscar por nombre..."
              value={searchNombre}
              onChange={(e) => setSearchNombre(e.target.value)}
            />
            <input
              type="text"
              className="form-control w-auto"
              placeholder="Buscar por DNI..."
              value={searchDni}
              onChange={(e) => setSearchDni(e.target.value)}
            />
            <select
              className="form-select w-auto"
              value={filtroActivo}
              onChange={(e) => setFiltroActivo(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="activos">Activos</option>
              <option value="inactivos">Inactivos</option>
            </select>
          </div>
          {loadError ? (
            <div className="alert alert-danger" role="alert">
              {loadError}
            </div>
          ) : null}
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <DataTable
              columns={["#", "Nombre Completo", "DNI", "Email", "Teléfono", "Estado", "Acciones"]}
              emptyMessage="No hay registros de dueños disponibles."
              colSpan={7}
            >
              {duenos.map((dueno, index) => (
                <tr
                  key={dueno.id || index}
                  onClick={() => setSelectedDueno(dueno)}
                  className={
                    selectedDueno?.id === dueno.id
                      ? "table-primary fw-bold"
                      : ""
                  }
                  style={{ cursor: "pointer" }}
                >
                  <td>{index + 1}</td>
                  <td>
                    {dueno.nombre} {dueno.apellido}
                  </td>
                  <td>{dueno.dni}</td>
                  <td>{dueno.email}</td>
                  <td>{dueno.telefono || "—"}</td>
                  <td>
                    <span
                      className={`badge ${dueno.activo ? "bg-success" : "bg-danger"}`}
                    >
                      {dueno.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td>
                    <ActionButtons
                      activo={dueno.activo}
                      onEdit={() => handleOpenEditDuenoModal(dueno)}
                      onToggle={() => handleToggleDueno(dueno.id)}
                      onDelete={() => setConfirmDelete(dueno.id)}
                      size="sm"
                    />
                  </td>
                </tr>
              ))}
            </DataTable>
          )}
        </div>
        <div className="card-footer text-muted small py-2">
          Total de dueños: {duenos.length}
        </div>
      </div>

      <section className="card p-3 bg-white shadow-sm mt-4">
        <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
          <div>
            <h3 className="h5 mb-1 text-dark">
              <i className="bi bi-telephone-forward-fill me-2 text-secondary"></i>
              Contactos de Emergencia Vinculados
            </h3>
            <p className="text-muted small mb-0">
              {selectedDueno
                ? `Mostrando registros asignados a: ${selectedDueno.nombre} ${selectedDueno.apellido}`
                : "Haz clic sobre un dueño de la lista de arriba para cargar sus contactos."}
            </p>
          </div>
          {selectedDueno && (
            <button
              className="btn btn-sm btn-dark"
              onClick={() => setOpenContactoModal(true)}
            >
              <i className="bi bi-telephone-plus-fill me-1"></i> Añadir Contacto
            </button>
          )}
        </div>

        {selectedDueno && (
          <div className="d-flex flex-wrap gap-2 mb-3 pb-2 border-bottom">
            <input
              type="text"
              className="form-control form-control-sm w-auto"
              placeholder="Filtrar por nombre..."
              value={searchContactoNombre}
              onChange={(e) => setSearchContactoNombre(e.target.value)}
            />
            <input
              type="text"
              className="form-control form-control-sm w-auto"
              placeholder="Filtrar por teléfono..."
              value={searchContactoTelefono}
              onChange={(e) => setSearchContactoTelefono(e.target.value)}
            />
            <input
              type="text"
              className="form-control form-control-sm w-auto"
              placeholder="Filtrar por relación..."
              value={searchContactoRelacion}
              onChange={(e) => setSearchContactoRelacion(e.target.value)}
            />
          </div>
        )}

        {!selectedDueno ? (
          <div className="text-center py-4 bg-light text-muted border rounded small">
            Ningún dueño seleccionado en este momento.
          </div>
        ) : contactos.length === 0 ? (
          <div className="text-center py-4 text-muted small">
            Este dueño no cuenta con contactos de emergencia registrados.
          </div>
        ) : (
          <div className="row g-3">
            {contactos.map((contacto, idx) => (
              <div key={contacto.id || idx} className="col-md-6">
                <div className="p-3 border rounded bg-light d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1 fw-bold text-dark">{contacto.nombre}</h6>
                    <p className="mb-0 text-muted small">
                      <i className="bi bi-telephone-fill me-1"></i>
                      Teléfono: {contacto.telefono}
                    </p>
                    {contacto.relacion && (
                      <span
                        className="badge bg-secondary mt-1 text-white"
                        style={{ fontSize: "10px" }}
                      >
                        {contacto.relacion}
                      </span>
                    )}
                  </div>
                  <button
                    className="btn btn-sm btn-outline-danger border-0"
                    onClick={() => setConfirmDeleteContacto(contacto.id)}
                  >
                    <i className="bi bi-trash-fill"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <DuenoFormDialog
        isOpen={openDuenoModal}
        onClose={handleCloseDuenoModal}
        initialData={selectedDueno ? mapDuenoToRequest(selectedDueno) : null}
        mode={selectedDueno && openDuenoModal ? "edit" : "create"}
        onSubmit={handleSaveDueno}
      />

      <ContactoFormDialog
        isOpen={openContactoModal}
        onClose={() => setOpenContactoModal(false)}
        onSubmit={handleSaveContacto}
      />

      <ConfirmDialog
        isOpen={confirmDelete !== null}
        title="Eliminar dueño"
        message="¿Estás seguro de eliminar permanentemente este dueño? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirmDelete(null)}
      />

      <ConfirmDialog
        isOpen={confirmDeleteContacto !== null}
        title="Eliminar contacto"
        message="¿Estás seguro de eliminar permanentemente este contacto de emergencia? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={() => {
          if (confirmDeleteContacto !== null) {
            handleDeleteContacto(confirmDeleteContacto);
          }
        }}
        onCancel={() => setConfirmDeleteContacto(null)}
      />
    </div>
  );
};

export default DuenosPage;
