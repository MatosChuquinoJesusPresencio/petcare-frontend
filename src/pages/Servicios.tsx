import { useEffect, useState } from "react";

import ServiceFormDialog from "../components/ServiceFormDialog";
import {
  createServicio,
  deleteServicio,
  getServicios,
  updateServicio,
} from "../services/servicioApi";
import type {
  ServicioRequest,
  ServicioResponse,
} from "../types/serviciosType";

const Servicios = () => {
  const [servicios, setServicios] = useState<ServicioResponse[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [selectedServicio, setSelectedServicio] =
    useState<ServicioResponse | null>(null);

  async function cargarServicios() {
    try {
      setLoadError("");
      const data = await getServicios();
      setServicios(data);
      console.log("Servicios en componente:", data);
    } catch (error) {
      console.error("Error al cargar servicios:", error);
      setLoadError("No se pudieron cargar los servicios.");
    }
  }

  useEffect(() => {
    cargarServicios();
  }, []);

  async function handleSaveServicio(data: ServicioRequest) {
    if (selectedServicio) {
      await updateServicio(selectedServicio.id, data);
    } else {
      await createServicio(data);
    }

    await cargarServicios();
    setSelectedServicio(null);
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
    const confirmed = window.confirm("¿Desea eliminar este Servicio?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteServicio(id);
      await cargarServicios();
    } catch (error) {
      console.error("Error al eliminar servicio:", error);
      setLoadError("No se pudo eliminar el servicio.");
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
      {/* HEADER SECTION */}
      <section className="card mb-3">
        <div className="card-body d-flex flex-row justify-content-between align-items-center">
          <div>
            <div className="d-flex gap-2 align-items-center">
              <span className="d-flex d-inline-flex items-center gap-2">
                <i className="bi bi-list-check fs-2"></i>
              </span>
              <h1 className="mb-2 text-[clamp(1.5rem,2.5vw,2.7rem)]">
                Servicios
              </h1>
            </div>
            <p>Vista donde podrás revisar y gestionar los servicios</p>
          </div>
          <div className="">
            {/*Trigger Formulario */}
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
      {/* TABLA SERVICIOS*/}
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
              <td className="d-flex justify-content-evenly">
                <button
                  className="btn btn-warning"
                  onClick={() => handleOpenEditModal(servicio)}
                >
                  <i className="bi bi-pencil-fill"></i>
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteServicio(servicio.id)}
                >
                  <i className="bi bi-trash3-fill"></i>
                </button>
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
    </div>
  );
};

export default Servicios;
