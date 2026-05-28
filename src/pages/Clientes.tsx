import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useEffect, useState } from "react";

import DuenoFormDialog from "../components/ClienteFormDialog.tsx";
import ContactoFormDialog from "../components/ContactoFormDialog";

import {
  createDueno,
  deactivateDueno,
  getDuenos,
  updateDueno,
} from "../service/clienteApi.ts";
import {
  createContacto,
  deleteContacto,
  getContactosByDuenoId,
} from "../service/contactoApi";

import type { Dueno, DuenoRequest } from "../types/cliente.ts";
import type {
  ContactoEmergencia,
  ContactoEmergenciaRequest,
} from "../types/contacto";

const Duenos = () => {
  // Estados de Dueños
  const [duenos, setDuenos] = useState<Dueno[]>([]);
  const [selectedDueno, setSelectedDueno] = useState<Dueno | null>(null);
  const [openDuenoModal, setOpenDuenoModal] = useState(false);

  // Estados de Contactos de Emergencia
  const [contactos, setContactos] = useState<ContactoEmergencia[]>([]);
  const [openContactoModal, setOpenContactoModal] = useState(false);

  // Mensajes de error globales
  const [loadError, setLoadError] = useState("");

  // --- MÉTODOS DE CARGA (API) ---

  async function cargarDuenos() {
    try {
      setLoadError("");
      const data = await getDuenos();
      setDuenos(data);
    } catch (error) {
      console.error("Error al cargar dueños:", error);
      setLoadError("No se pudieron cargar los registros de dueños.");
    }
  }

  async function cargarContactos(duenoId: number) {
    try {
      const data = await getContactosByDuenoId(duenoId);
      setContactos(data);
    } catch (error) {
      console.error("Error al cargar contactos de emergencia:", error);
    }
  }

  useEffect(() => {
    cargarDuenos();
  }, []);

  // Escucha cambios en la fila seleccionada para actualizar los contactos
  useEffect(() => {
    if (selectedDueno) {
      cargarContactos(selectedDueno.id);
    } else {
      setContactos([]);
    }
  }, [selectedDueno]);

  // --- HANDLERS PARA DUEÑOS ---

  async function handleSaveDueno(data: DuenoRequest) {
    if (selectedDueno) {
      const duenoEditado = await updateDueno(selectedDueno.id, data);
      // Mantener la fila seleccionada sincronizada en tiempo real con los nuevos datos
      if (selectedDueno.id === duenoEditado.id) {
        setSelectedDueno(duenoEditado);
      }
    } else {
      await createDueno(data);
    }

    await cargarDuenos();
    setOpenDuenoModal(false);
  }

  async function handleDeactivateDueno(id: number) {
    const confirmed = window.confirm(
      "¿Desea cambiar el estado de este Dueño a Inactivo?",
    );
    if (!confirmed) return;

    try {
      await deactivateDueno(id);
      if (selectedDueno?.id === id) {
        setSelectedDueno(null);
      }
      await cargarDuenos();
    } catch (error) {
      console.error("Error al desactivar dueño:", error);
      setLoadError("No se pudo cambiar el estado del dueño.");
    }
  }

  function handleOpenCreateDuenoModal() {
    setSelectedDueno(null);
    setOpenDuenoModal(true);
  }

  function handleOpenEditDuenoModal(dueno: Dueno, e: React.MouseEvent) {
    e.stopPropagation(); // Evita que se altere la selección de la fila al hacer clic en Editar
    setSelectedDueno(dueno);
    setOpenDuenoModal(true);
  }

  function handleCloseDuenoModal() {
    setOpenDuenoModal(false);
    // Nota: No limpiamos selectedDueno aquí por si el usuario lo tenía seleccionado en la tabla inferior
  }

  // --- HANDLERS PARA CONTACTOS ---

  async function handleSaveContacto(data: ContactoEmergenciaRequest) {
    if (!selectedDueno) return;
    await createContacto(selectedDueno.id, data);
    await cargarContactos(selectedDueno.id);
    setOpenContactoModal(false);
  }

  async function handleDeleteContacto(id: number) {
    const confirmed = window.confirm(
      "¿Desea eliminar permanentemente este contacto?",
    );
    if (!confirmed) return;

    try {
      await deleteContacto(id);
      if (selectedDueno) {
        await cargarContactos(selectedDueno.id);
      }
    } catch (error) {
      console.error("Error al eliminar contacto:", error);
    }
  }

  // Mapeador idéntico a tu lógica de transformación de formato de referencia
  function mapDuenoToRequest(dueno: Dueno): DuenoRequest {
    return {
      firstName: dueno.firstName,
      lastName: dueno.lastName,
      dni: dueno.dni,
      email: dueno.email,
      phone: dueno.phone,
      address: dueno.address,
      userId: dueno.userId,
    };
  }

  return (
    <div className="container my-3">
      {/* HEADER SECTION */}
      <section className="card mb-3">
        <div className="card-body d-flex flex-row justify-content-between align-items-center">
          <div>
            <div className="d-flex gap-2 align-items-center">
              <span className="d-flex d-inline-flex items-center gap-2">
                <i className="bi bi-people-fill fs-2"></i>
              </span>
              <h1 className="mb-2 text-[clamp(1.5rem,2.5vw,2.7rem)]">
                Dueños de Mascotas
              </h1>
            </div>
            <p className="mb-0">
              Vista donde podrás revisar y gestionar los dueños y sus contactos
            </p>
          </div>
          <div>
            <button
              className="btn btn-success"
              onClick={handleOpenCreateDuenoModal}
            >
              <i className="bi bi-plus-circle-fill"></i> Nuevo Dueño
            </button>
          </div>
        </div>
      </section>

      {loadError ? (
        <div className="alert alert-danger" role="alert">
          {loadError}
        </div>
      ) : null}

      {/* TABLA PRINCIPAL: DUEÑOS */}
      <div className="card mb-4">
        <div className="card-header bg-light">
          <small className="text-muted fw-bold">
            Selecciona una fila para administrar sus contactos de emergencia
          </small>
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-light table-bordered table-hover mb-0">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nombre Completo</th>
                <th scope="col">DNI</th>
                <th scope="col">Email</th>
                <th scope="col">Teléfono</th>
                <th scope="col">Estado</th>
                <th scope="col" className="text-center">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {duenos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-3 text-muted">
                    No hay registros de dueños disponibles.
                  </td>
                </tr>
              ) : (
                duenos.map((dueno, index) => (
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
                    <th scope="row">{index + 1}</th>
                    <td>
                      {dueno.firstName} {dueno.lastName}
                    </td>
                    <td>{dueno.dni}</td>
                    <td>{dueno.email}</td>
                    <td>{dueno.phone || "—"}</td>
                    <td>
                      <span
                        className={`badge ${dueno.activo ? "bg-success" : "bg-danger"}`}
                      >
                        {dueno.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="d-flex justify-content-evenly">
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={(e) => handleOpenEditDuenoModal(dueno, e)}
                        >
                          <i className="bi bi-pencil-fill"></i>
                        </button>
                        {dueno.activo && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeactivateDueno(dueno.id)}
                          >
                            <i className="bi bi-shield-x"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <p>Total de dueños cargados: {duenos.length}</p>

      {/* SUB-SECCIÓN INFERIOR: CONTACTOS DE EMERGENCIA */}
      <section className="card p-3 bg-white shadow-sm mt-4">
        <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
          <div>
            <h3 className="h5 mb-1 text-dark">
              <i className="bi bi-telephone-forward-fill me-2 text-secondary"></i>
              Contactos de Emergencia Vinculados
            </h3>
            <p className="text-muted small mb-0">
              {selectedDueno
                ? `Mostrando registros asignados a: ${selectedDueno.firstName} ${selectedDueno.lastName}`
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
                    <h6 className="mb-1 fw-bold text-dark">{contacto.name}</h6>
                    <p className="mb-0 text-muted small">
                      📞 Teléfono: {contacto.phone}
                    </p>
                    {contacto.relation && (
                      <span
                        className="badge bg-secondary mt-1 text-white"
                        style={{ fontSize: "10px" }}
                      >
                        {contacto.relation}
                      </span>
                    )}
                  </div>
                  <button
                    className="btn btn-sm btn-outline-danger border-0"
                    onClick={() => handleDeleteContacto(contacto.id)}
                  >
                    <i className="bi bi-trash-fill"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- MODAL CONTROLADO DE DUEÑO --- */}
      <DuenoFormDialog
        isOpen={openDuenoModal}
        onClose={handleCloseDuenoModal}
        initialData={selectedDueno ? mapDuenoToRequest(selectedDueno) : null}
        mode={selectedDueno && openDuenoModal ? "edit" : "create"}
        onSubmit={handleSaveDueno}
      />

      {/* --- MODAL CONTROLADO DE CONTACTOS --- */}
      <ContactoFormDialog
        isOpen={openContactoModal}
        onClose={() => setOpenContactoModal(false)}
        onSubmit={handleSaveContacto}
      />
    </div>
  );
};

export default Duenos;
