import { useEffect, useState } from "react";

import { useAuth } from "../hooks/useAuth";
import ActionButtons from "../components/common/ActionButtons";

import ConfirmDialog from "../components/common/ConfirmDialog";

import ContactoFormDialog from "../components/duenos/ContactoFormDialog";

import DataTable from "../components/common/DataTable";

import DuenoFormDialog from "../components/duenos/DuenoFormDialog";
import type { DuenoFormData } from "../components/duenos/DuenoFormDialog";

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
} from "../types";

const DuenosPage = () => {
  const { user } = useAuth();
  const puedeGestionar = user?.role === 'ADMINISTRADOR' || user?.role === 'ASISTENTE';
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

  async function handleSaveDueno(data: DuenoFormData) {
    if (selectedDueno) {
      const duenoEditado = await updateDueno(selectedDueno.id, {
        dni: data.dni,
        phone: data.phone || undefined,
        address: data.address || undefined,
        userId: selectedDueno.usuario?.id ?? undefined,
      });
      if (selectedDueno.id === duenoEditado.id) {
        setSelectedDueno(duenoEditado);
      }
    } else {
      await createDueno({
        dni: data.dni,
        phone: data.phone || undefined,
        address: data.address || undefined,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.dni,
      });
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

  function mapDuenoToFormData(dueno: Dueno): DuenoFormData | null {
    if (!dueno.usuario) return null;
    return {
      firstName: dueno.usuario.names,
      lastName: dueno.usuario.lastNames,
      dni: dueno.dni,
      email: dueno.usuario.email,
      phone: dueno.phone ?? "",
      address: dueno.address ?? "",
    };
  }

  return (
    <div className="contenedor-pagina">
      <div className="container">
        <NotificationToast toast={toast} onClose={() => setToast(null)} />

        <PageHeader icon="bi-people-fill" title="Dueños de Mascotas" description="Gestiona los dueños y sus contactos de emergencia">
          {puedeGestionar && (
            <button className="boton boton--primario" onClick={handleOpenCreateDuenoModal}>
              <i className="bi bi-plus-circle-fill me-1"></i>Nuevo Dueño
            </button>
          )}
        </PageHeader>

        <p style={{ fontSize: 'var(--tamano-sm)', color: 'var(--color-texto-secundario)', marginBottom: 'var(--espaciado-md)' }}>
          <i className="bi bi-info-circle me-1"></i>
          Selecciona una fila para administrar sus contactos de emergencia
        </p>

        <div className="barra-filtros animacion-entrada">
          <div className="barra-filtros-grupo">
            <label>Nombre</label>
            <input type="text" className="campo-entrada" placeholder="Buscar por nombre..." value={searchNombre} onChange={(e) => setSearchNombre(e.target.value)} />
          </div>
          <div className="barra-filtros-grupo">
            <label>DNI</label>
            <input type="text" className="campo-entrada" placeholder="Buscar por DNI..." value={searchDni} onChange={(e) => setSearchDni(e.target.value)} />
          </div>
          <div className="barra-filtros-grupo">
            <label>Estado</label>
            <select className="campo-entrada" value={filtroActivo} onChange={(e) => setFiltroActivo(e.target.value)}>
              <option value="todos">Todos</option>
              <option value="activos">Activos</option>
              <option value="inactivos">Inactivos</option>
            </select>
          </div>
        </div>

        <div className="tarjeta animacion-entrada" style={{ animationDelay: '0.05s' }}>
          <div className="tarjeta-cuerpo">
            {loadError ? (
              <div className="dialogo-error" style={{ marginBottom: 0 }}>{loadError}</div>
            ) : loading ? (
              <div className="estado-cargando">
                <div className="spinner-border" style={{ color: 'var(--color-primario)' }} role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : (
              <DataTable
                columns={["#", "Nombre", "DNI", "Teléfono", "Dirección", ...(puedeGestionar ? ["Acciones"] : [])]}
                emptyMessage="No hay registros de dueños disponibles."
                colSpan={puedeGestionar ? 6 : 5}
              >
                {duenos.map((dueno, index) => (
                  <tr
                    key={dueno.id || index}
                    onClick={() => setSelectedDueno(dueno)}
                    style={{
                      cursor: "pointer",
                      backgroundColor: selectedDueno?.id === dueno.id ? 'rgba(21, 67, 58, 0.06)' : undefined,
                      fontWeight: selectedDueno?.id === dueno.id ? 'var(--peso-seminegrita)' : undefined,
                    }}
                  >
                    <td><span className="numero-fila">{index + 1}</span></td>
                    <td>{dueno.usuario ? `${dueno.usuario.names} ${dueno.usuario.lastNames}` : dueno.dni}</td>
                    <td>{dueno.dni}</td>
                    <td>{dueno.phone || "—"}</td>
                    <td>{dueno.address || "—"}</td>
                    {puedeGestionar && (
                      <td>
                        <ActionButtons
                          activo={true}
                          onEdit={() => handleOpenEditDuenoModal(dueno)}
                          onToggle={() => handleToggleDueno(dueno.id)}
                          onDelete={() => setConfirmDelete(dueno.id)}
                        />
                      </td>
                    )}
                  </tr>
                ))}
              </DataTable>
            )}
          </div>
          <div className="tarjeta-pie" style={{ fontSize: 'var(--tamano-sm)', color: 'var(--color-texto-claro)' }}>
            Total de dueños: {duenos.length}
          </div>
        </div>

        <div className="tarjeta animacion-entrada" style={{ marginTop: 'var(--espaciado-lg)', animationDelay: '0.1s' }}>
          <div className="tarjeta-encabezado">
            <div>
              <h5 className="tarjeta-encabezado-titulo">
                <i className="bi bi-telephone-forward-fill"></i>
                Contactos de Emergencia
              </h5>
              <p className="tarjeta-encabezado-descripcion">
                {selectedDueno
                  ? `Mostrando registros asignados a: ${selectedDueno.dni}`
                  : "Haz clic sobre un dueño de la lista para cargar sus contactos."}
              </p>
            </div>
            {selectedDueno && puedeGestionar && (
              <button className="boton boton--secundario boton--pequeno" onClick={() => setOpenContactoModal(true)}>
                <i className="bi bi-telephone-plus-fill me-1"></i>Añadir Contacto
              </button>
            )}
          </div>

          <div className="tarjeta-cuerpo">
            {selectedDueno && (
              <div className="barra-filtros" style={{ marginBottom: 'var(--espaciado-md)', padding: 'var(--espaciado-sm) var(--espaciado-md)' }}>
                <div className="barra-filtros-grupo">
                  <label>Nombre</label>
                  <input type="text" className="campo-entrada" placeholder="Filtrar por nombre..." value={searchContactoNombre} onChange={(e) => setSearchContactoNombre(e.target.value)} />
                </div>
                <div className="barra-filtros-grupo">
                  <label>Teléfono</label>
                  <input type="text" className="campo-entrada" placeholder="Filtrar por teléfono..." value={searchContactoTelefono} onChange={(e) => setSearchContactoTelefono(e.target.value)} />
                </div>
                <div className="barra-filtros-grupo">
                  <label>Relación</label>
                  <input type="text" className="campo-entrada" placeholder="Filtrar por relación..." value={searchContactoRelacion} onChange={(e) => setSearchContactoRelacion(e.target.value)} />
                </div>
              </div>
            )}

            {!selectedDueno ? (
              <div style={{ textAlign: 'center', padding: 'var(--espaciado-2xl)', color: 'var(--color-texto-claro)', fontSize: 'var(--tamano-sm)' }}>
                Ningún dueño seleccionado en este momento.
              </div>
            ) : contactos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 'var(--espaciado-2xl)', color: 'var(--color-texto-claro)', fontSize: 'var(--tamano-sm)' }}>
                Este dueño no cuenta con contactos de emergencia registrados.
              </div>
            ) : (
              <div className="row g-3">
                {contactos.map((contacto, idx) => (
                  <div key={contacto.id || idx} className="col-md-6">
                    <div style={{
                      padding: 'var(--espaciado-md)', border: '1px solid var(--color-borde-claro)',
                      borderRadius: 'var(--radio-borde)', display: 'flex',
                      justifyContent: 'space-between', alignItems: 'center',
                      background: 'var(--color-fondo)'
                    }}>
                      <div>
                        <h6 style={{ margin: '0 0 var(--espaciado-xs)', fontWeight: 'var(--peso-negrita)' }}>{contacto.name}</h6>
                        <p style={{ margin: 0, fontSize: 'var(--tamano-sm)', color: 'var(--color-texto-secundario)' }}>
                          <i className="bi bi-telephone-fill me-1"></i>
                          {contacto.phone}
                        </p>
                        {contacto.relation && (
                          <span className="etiqueta etiqueta--secundario" style={{ marginTop: 'var(--espaciado-xs)', fontSize: '10px' }}>
                            {contacto.relation}
                          </span>
                        )}
                      </div>
                      {puedeGestionar && (
                        <button
                          className="boton boton--peligro boton--icono"
                          style={{ background: 'transparent', color: 'var(--color-peligro)' }}
                          onClick={() => setConfirmDeleteContacto(contacto.id)}
                          title="Eliminar contacto"
                        >
                          <i className="bi bi-trash-fill"></i>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DuenoFormDialog
          isOpen={openDuenoModal}
          onClose={handleCloseDuenoModal}
          initialData={selectedDueno && openDuenoModal ? mapDuenoToFormData(selectedDueno) : null}
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
    </div>
  );
};

export default DuenosPage;
