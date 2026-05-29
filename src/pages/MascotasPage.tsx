import { useEffect, useState } from "react";

import type { MascotaResponse } from "../types/mascotaType";

import { obtenerMascotas, eliminarMascota, toggleMascota } from "../services/mascotaService";

import ConfirmDialog from "../components/ConfirmDialog";
import MascotaTable from "../components/mascotas/MascotaTable";
import MascotaModal from "../components/mascotas/MascotaModal";
import MascotaVincularModal from "../components/mascotas/MascotaVincularModal";

const MascotasPage = () => {
  const [mascotas, setMascotas] = useState<MascotaResponse[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [mascotaEditarId, setMascotaEditarId] = useState<number | null>(null);
  const [showVincularModal, setShowVincularModal] = useState(false);
  const [mascotaVincularId, setMascotaVincularId] = useState<number | null>(null);
  const [confirmDeleteMascota, setConfirmDeleteMascota] = useState<number | null>(null);

  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroEspecie, setFiltroEspecie] = useState("");
  const [filtroRaza, setFiltroRaza] = useState("");
  const [filtroSexo, setFiltroSexo] = useState<string>("todos");
  const [filtroActivo, setFiltroActivo] = useState<string>("todos");

  useEffect(() => {
    const timer = setTimeout(() => {
      cargarMascotas();
    });
    return () => clearTimeout(timer);
  }, [filtroNombre, filtroEspecie, filtroRaza, filtroSexo, filtroActivo]);

  const cargarMascotas = async () => {
    try {
      const params: { nombre?: string; especie?: string; raza?: string; sexo?: string; activo?: boolean } = {};
      if (filtroNombre.trim()) params.nombre = filtroNombre.trim();
      if (filtroEspecie.trim()) params.especie = filtroEspecie.trim();
      if (filtroRaza.trim()) params.raza = filtroRaza.trim();
      if (filtroSexo !== "todos") params.sexo = filtroSexo;
      if (filtroActivo === "activos") params.activo = true;
      else if (filtroActivo === "inactivos") params.activo = false;
      const data = await obtenerMascotas(params);
      setMascotas(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNuevaMascota = () => {
    setMascotaEditarId(null);
    setShowModal(true);
  };

  const handleEditar = (id: number) => {
    setMascotaEditarId(id);
    setShowModal(true);
  };

  const handleToggleMascota = async (id: number) => {
    try {
      await toggleMascota(id);
      await cargarMascotas();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (confirmDeleteMascota === null) return;
    try {
      await eliminarMascota(confirmDeleteMascota);
      await cargarMascotas();
    } catch (error) {
      console.error(error);
    } finally {
      setConfirmDeleteMascota(null);
    }
  };

  const handleVincular = (id: number) => {
    setMascotaVincularId(id);
    setShowVincularModal(true);
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm mb-4">
        <div className="card-body d-flex flex-row justify-content-between align-items-center">
          <div>
            <h1 className="mb-1">Mascotas</h1>
            <p className="text-muted mb-0">
              Vista donde podrás revisar y gestionar mascotas
            </p>
          </div>
          <button className="btn btn-success" onClick={handleNuevaMascota}>
            <i className="bi bi-plus-circle-fill"></i>
          </button>
        </div>
      </div>

      <section className="card mb-3">
        <div className="card-body d-flex flex-wrap gap-2 align-items-center">
          <input
            type="text"
            className="form-control w-auto"
            placeholder="Filtrar por nombre..."
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
          />
          <input
            type="text"
            className="form-control w-auto"
            placeholder="Filtrar por especie..."
            value={filtroEspecie}
            onChange={(e) => setFiltroEspecie(e.target.value)}
          />
          <input
            type="text"
            className="form-control w-auto"
            placeholder="Filtrar por raza..."
            value={filtroRaza}
            onChange={(e) => setFiltroRaza(e.target.value)}
          />
          <select
            className="form-select w-auto"
            value={filtroSexo}
            onChange={(e) => setFiltroSexo(e.target.value)}
          >
            <option value="todos">Todos los sexos</option>
            <option value="MACHO">Macho</option>
            <option value="HEMBRA">Hembra</option>
          </select>
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
      </section>

      <MascotaTable
        mascotas={mascotas}
        onEdit={handleEditar}
        onDelete={(id) => setConfirmDeleteMascota(id)}
        onToggle={handleToggleMascota}
        onVincular={handleVincular}
      />

      <p>Total de mascotas cargadas: {mascotas.length}</p>

      <MascotaModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={cargarMascotas}
        mascotaId={mascotaEditarId}
      />

      <MascotaVincularModal
        show={showVincularModal}
        mascotaId={mascotaVincularId}
        onClose={() => setShowVincularModal(false)}
        onSuccess={cargarMascotas}
      />

      <ConfirmDialog
        isOpen={confirmDeleteMascota !== null}
        title="Desactivar mascota"
        message="¿Estás seguro de desactivar esta mascota? Puedes volver a activarla después."
        confirmText="Desactivar"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirmDeleteMascota(null)}
      />
    </div>
  );
};

export default MascotasPage;
