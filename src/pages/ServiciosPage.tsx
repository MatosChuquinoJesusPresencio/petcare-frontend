import { useCallback, useEffect, useState } from "react";

import { useAuth } from "../hooks/useAuth";
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
  const { user } = useAuth();
  const puedeGestionar = user?.role === 'ADMINISTRADOR';
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
      name: servicio.name,
      description: servicio.description,
      durationMinutes: servicio.durationMinutes,
      referentialCost: servicio.referenceCost,
    };
  }

  return (
    <div className="contenedor-pagina">
      <div className="container">
        <NotificationToast toast={toast} onClose={() => setToast(null)} />

        <PageHeader icon="bi-list-check" title="Servicios" description="Gestiona los servicios ofrecidos en la clínica">
          {puedeGestionar && (
            <button className="boton boton--primario" onClick={handleOpenCreateModal}>
              <i className="bi bi-plus-circle-fill me-1"></i>Nuevo Servicio
            </button>
          )}
        </PageHeader>

        <div className="barra-filtros animacion-entrada">
          <div className="barra-filtros-grupo">
            <label>Nombre</label>
            <input
              type="text"
              className="campo-entrada"
              placeholder="Buscar por nombre..."
              value={searchNombre}
              onChange={(e) => setSearchNombre(e.target.value)}
            />
          </div>
          <div className="barra-filtros-grupo">
            <label>Estado</label>
            <select
              className="campo-entrada"
              value={filtroActivo}
              onChange={(e) => setFiltroActivo(e.target.value)}
            >
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
                columns={["#", "Nombre", "Descripción", "Tiempo (Min)", "Costo", "Estado", ...(puedeGestionar ? ["Acciones"] : [])]}
                emptyMessage="No hay servicios registrados."
                colSpan={puedeGestionar ? 7 : 6}
              >
                {servicios.map((servicio, index) => (
                  <tr key={servicio.id}>
                    <td><span className="numero-fila">{index + 1}</span></td>
                    <td>{servicio.name}</td>
                    <td>{servicio.description}</td>
                    <td>{servicio.durationMinutes}</td>
                    <td>S/.{servicio.referenceCost}</td>
                    <td>
                      <span className={`etiqueta ${servicio.active ? 'etiqueta--activo' : 'etiqueta--inactivo'}`}>
                        {servicio.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    {puedeGestionar && (
                      <td>
                        <ActionButtons
                          activo={servicio.active}
                          onEdit={() => handleOpenEditModal(servicio)}
                          onToggle={() => handleToggleServicio(servicio.id)}
                          onDelete={() => setConfirmDeleteServicio(servicio.id)}
                        />
                      </td>
                    )}
                  </tr>
                ))}
              </DataTable>
            )}
          </div>
          <div className="tarjeta-pie" style={{ fontSize: 'var(--tamano-sm)', color: 'var(--color-texto-claro)' }}>
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
    </div>
  );
};

export default ServiciosPage;
