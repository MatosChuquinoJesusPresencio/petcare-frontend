import { useCallback, useEffect, useState } from "react";

import ActionButtons from "../components/common/ActionButtons";

import ConfirmDialog from "../components/common/ConfirmDialog";

import DataTable from "../components/common/DataTable";

import NotificationToast from "../components/common/NotificationToast";
import type { ToastInfo } from "../components/common/NotificationToast";

import PageHeader from "../components/common/PageHeader";
import ServiceFormDialog from "../components/servicios/ServiceFormDialog";
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
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
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
    } finally {
      setLoading(false);
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
    <div className="container mt-4">
      <NotificationToast toast={toast} onClose={() => setToast(null)} />
      <PageHeader icon="bi-list-check" title="Servicios" description="Vista donde podrás revisar y gestionar los servicios">
        <button className="btn btn-success" onClick={handleOpenCreateModal}>
          <i className="bi bi-plus-circle-fill me-2"></i>Nuevo Servicio
        </button>
      </PageHeader>

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
              columns={["#", "Nombre", "Descripción", "Tiempo (Min)", "Costo", "Estado", "Acciones"]}
              emptyMessage="No hay servicios registrados."
              colSpan={7}
            >
              {servicios.map((servicio, index) => (
                <tr key={servicio.id || index}>
                  <td>{index + 1}</td>
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
            </DataTable>
          )}
        </div>
        <div className="card-footer text-muted small py-2">
          Total de servicios: {servicios.length}
        </div>
      </div>
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
