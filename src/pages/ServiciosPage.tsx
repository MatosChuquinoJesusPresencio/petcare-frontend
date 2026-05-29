import { useCallback, useEffect, useState } from "react";

import ActionButtons from "../components/ActionButtons";
import ConfirmDialog from "../components/ConfirmDialog";
import NotificationToast from "../components/NotificationToast";
import type { ToastInfo } from "../components/NotificationToast";
import ServiceFormDialog from "../components/modal/ServiceFormDialog";
import {
  createServicio,
  deleteServicio,
  getServicios,
  toggleServicio,
  updateServicio,
} from "../services";
import type {
  ServicioRequest,
  ServicioResponse,
} from "../types";

const ServiciosPage = () => {
  const [servicios, setServicios] = useState<ServicioResponse[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [selectedServicio, setSelectedServicio] =
    useState<ServicioResponse | null>(null);
  const [filtroActivo, setFiltroActivo] = useState<string>("todos");
  const [searchNombre, setSearchNombre] = useState("");
  const [confirmDeleteServicio, setConfirmDeleteServicio] = useState<number | null>(null);
  const [toast, setToast] = useState<ToastInfo | null>(null);

  const cargarServicios = useCallback(async () => {
    try {
      setLoadError("");
      const params: { soloActivos?: boolean; nombre?: string } = {};

      if (filtroActivo === "activos") {
        params.soloActivos = true;
      } else if (filtroActivo === "inactivos") {
        params.soloActivos = false;
      }

      if (searchNombre.trim()) {
        params.nombre = searchNombre.trim();
      }

      const data = await getServicios(params);
      setServicios(data);
    } catch (error) {
      console.error("Error al cargar servicios:", error);
      setLoadError("No se pudieron cargar los servicios.");
    }
  }, [filtroActivo, searchNombre]);

  useEffect(() => {
    const t = setTimeout(cargarServicios);
    return () => clearTimeout(t);
  }, [cargarServicios]);

  async function handleSaveServicio(data: ServicioRequest) {
    if (selectedServicio) {
      await updateServicio(selectedServicio.id, data);
    } else {
      await createServicio(data);
    }

    await cargarServicios();
    setSelectedServicio(null);
    setToast({ message: "Servicio guardado correctamente.", type: "success" });
  }

  function handleOpenCreateModal() {
    setSelectedServicio(null);
    setOpenModal(true);
  }

  function handleOpenEditModal(servicio: ServicioResponse) {
    setSelectedServicio(servicio);
    setOpenModal(true);
  }

  function handleCloseModal() {
    setOpenModal(false);
    setSelectedServicio(null);
  }

  async function handleDeleteServicio(id: number) {
    try {
      await deleteServicio(id);
      await cargarServicios();
      setToast({ message: "Servicio eliminado correctamente.", type: "success" });
    } catch (error) {
      console.error("Error al eliminar servicio:", error);
      setToast({ message: "No se pudo eliminar el servicio.", type: "error" });
    } finally {
      setConfirmDeleteServicio(null);
    }
  }

  async function handleToggleServicio(id: number) {
    try {
      await toggleServicio(id);
      await cargarServicios();
      setToast({ message: "Estado del servicio actualizado correctamente.", type: "success" });
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      setToast({ message: "No se pudo cambiar el estado del servicio.", type: "error" });
    }
  }

  function mapServicioToRequest(servicio: ServicioResponse): ServicioRequest {
    return {
      name: servicio.nombre,
      description: servicio.descripcion,
      durationMinutes: servicio.duracionMinutos,
      referentialCost: servicio.costoReferencial,
    };
  }

  return (
    <div className="container my-3">
      <NotificationToast toast={toast} onClose={() => setToast(null)} />
      <section className="card mb-3">
        <div className="card-body d-flex flex-row justify-content-between align-items-center">
          <div>
            <div className="d-flex gap-2 align-items-center">
              <span className="d-flex d-inline-flex items-center gap-2">
                <i className="bi bi-list-check fs-2"></i>
              </span>
              <h1 className="mb-2">Servicios</h1>
            </div>
            <p>Vista donde podrás revisar y gestionar los servicios</p>
          </div>
          <div className="d-flex gap-2 align-items-center">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre..."
              value={searchNombre}
              onChange={(e) => setSearchNombre(e.target.value)}
            />
            <select
              className="form-select"
              value={filtroActivo}
              onChange={(e) => setFiltroActivo(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="activos">Activos</option>
              <option value="inactivos">Inactivos</option>
            </select>
            <button
              className="btn btn-success"
              onClick={handleOpenCreateModal}
            >
              <i className="bi bi-plus-circle-fill"></i>
            </button>
          </div>
        </div>
      </section>
      {loadError ? (
        <div className="alert alert-danger" role="alert">
          {loadError}
        </div>
      ) : null}
      <table className="table table-striped table-light table-bordered">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nombre</th>
            <th scope="col">Descripción</th>
            <th scope="col">Tiempo (Min)</th>
            <th scope="col">Costo</th>
            <th scope="col">Estado</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {servicios.map((servicio, index) => (
            <tr key={servicio.id || index}>
              <th scope="row">{index + 1}</th>
              <td>{servicio.nombre}</td>
              <td>{servicio.descripcion}</td>
              <td>{servicio.duracionMinutos}</td>
              <td>S/.{servicio.costoReferencial}</td>
              <td>
                <span
                  className={`badge ${servicio.activo ? "bg-success" : "bg-danger"}`}
                >
                  {servicio.activo ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td>
                <ActionButtons
                  activo={servicio.activo}
                  onEdit={() => handleOpenEditModal(servicio)}
                  onToggle={() => handleToggleServicio(servicio.id)}
                  onDelete={() => setConfirmDeleteServicio(servicio.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Total de servicios cargados: {servicios.length}</p>
      <ServiceFormDialog
        isOpen={openModal}
        onClose={handleCloseModal}
        initialData={
          selectedServicio ? mapServicioToRequest(selectedServicio) : null
        }
        mode={selectedServicio ? "edit" : "create"}
        onSubmit={handleSaveServicio}
      />

      <ConfirmDialog
        isOpen={confirmDeleteServicio !== null}
        title="Eliminar servicio"
        message="¿Estás seguro de eliminar permanentemente este servicio? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={() => {
          if (confirmDeleteServicio !== null) {
            handleDeleteServicio(confirmDeleteServicio);
          }
        }}
        onCancel={() => setConfirmDeleteServicio(null)}
      />
    </div>
  );
};

export default ServiciosPage;
