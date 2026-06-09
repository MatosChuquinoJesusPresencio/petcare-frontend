import { useEffect, useState } from "react";

import type { MascotaResponse } from "../types";

import { eliminarMascota, obtenerMascotas, toggleMascota } from "../services";

import { SEXOS_MASCOTA, SEXO_LABEL } from "../constants";
import ConfirmDialog from "../components/common/ConfirmDialog";

import NotificationToast from "../components/common/NotificationToast";
import type { ToastInfo } from "../components/common/NotificationToast";

import MascotaTable from "../components/mascotas/MascotaTable";
import MascotaModal from "../components/mascotas/MascotaModal";
import MascotaVincularModal from "../components/mascotas/MascotaVincularModal";
import PageHeader from "../components/common/PageHeader";

const MascotasPage = () => {
  const [mascotas, setMascotas] = useState<MascotaResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [mascotaEditarId, setMascotaEditarId] = useState<number | null>(null);
  const [showVincularModal, setShowVincularModal] = useState(false);
  const [mascotaVincularId, setMascotaVincularId] = useState<number | null>(null);
  const [confirmDeleteMascota, setConfirmDeleteMascota] = useState<number | null>(null);
  const [toast, setToast] = useState<ToastInfo | null>(null);

  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroEspecie, setFiltroEspecie] = useState("");
  const [filtroRaza, setFiltroRaza] = useState("");
  const [filtroSexo, setFiltroSexo] = useState<string>("todos");
  const [filtroActivo, setFiltroActivo] = useState<string>("todos");

  const cargarMascotas = async () => {
    try {
      setLoading(true);
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
      setToast({ message: "No se pudieron cargar las mascotas.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(cargarMascotas);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroNombre, filtroEspecie, filtroRaza, filtroSexo, filtroActivo]);

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
      setToast({ message: "Estado de la mascota actualizado correctamente.", type: "success" });
    } catch (error) {
      console.error(error);
      setToast({ message: "No se pudo cambiar el estado de la mascota.", type: "error" });
    }
  };

  const handleDeleteConfirmed = async () => {
    if (confirmDeleteMascota === null) return;
    try {
      await eliminarMascota(confirmDeleteMascota);
      await cargarMascotas();
      setToast({ message: "Mascota desactivada correctamente.", type: "success" });
    } catch (error) {
      console.error(error);
      setToast({ message: "No se pudo desactivar la mascota.", type: "error" });
    } finally {
      setConfirmDeleteMascota(null);
    }
  };

  const handleVincular = (id: number) => {
    setMascotaVincularId(id);
    setShowVincularModal(true);
  };

  return (
    <div className="contenedor-pagina">
      <div className="container">
        <NotificationToast toast={toast} onClose={() => setToast(null)} />

        <PageHeader icon="bi-heart" title="Mascotas" description="Registro y gestión de pacientes">
          <button className="boton boton--primario" onClick={handleNuevaMascota}>
            <i className="bi bi-plus-circle-fill me-1"></i>Nueva Mascota
          </button>
        </PageHeader>

        <div className="barra-filtros animacion-entrada">
          <div className="barra-filtros-grupo">
            <label>Nombre</label>
            <input type="text" className="campo-entrada" placeholder="Filtrar por nombre..." value={filtroNombre} onChange={(e) => setFiltroNombre(e.target.value)} />
          </div>
          <div className="barra-filtros-grupo">
            <label>Especie</label>
            <input type="text" className="campo-entrada" placeholder="Filtrar por especie..." value={filtroEspecie} onChange={(e) => setFiltroEspecie(e.target.value)} />
          </div>
          <div className="barra-filtros-grupo">
            <label>Raza</label>
            <input type="text" className="campo-entrada" placeholder="Filtrar por raza..." value={filtroRaza} onChange={(e) => setFiltroRaza(e.target.value)} />
          </div>
          <div className="barra-filtros-grupo">
            <label>Sexo</label>
            <select className="campo-entrada" value={filtroSexo} onChange={(e) => setFiltroSexo(e.target.value)}>
              <option value="todos">Todos los sexos</option>
              {SEXOS_MASCOTA.map((sexo) => (
                <option key={sexo} value={sexo}>{SEXO_LABEL[sexo]}</option>
              ))}
            </select>
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
            {loading ? (
              <div className="estado-cargando">
                <div className="spinner-border" style={{ color: 'var(--color-primario)' }} role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : (
              <MascotaTable
                mascotas={mascotas}
                onEdit={handleEditar}
                onDelete={(id) => setConfirmDeleteMascota(id)}
                onToggle={handleToggleMascota}
                onVincular={handleVincular}
              />
            )}
          </div>
          <div className="tarjeta-pie" style={{ fontSize: 'var(--tamano-sm)', color: 'var(--color-texto-claro)' }}>
            Total de mascotas: {mascotas.length}
          </div>
        </div>

        <MascotaModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={async () => {
            setToast({ message: "Mascota guardada correctamente.", type: "success" });
            await cargarMascotas();
          }}
          mascotaId={mascotaEditarId}
        />

        <MascotaVincularModal
          show={showVincularModal}
          mascotaId={mascotaVincularId}
          onClose={() => setShowVincularModal(false)}
          onSuccess={async () => {
            setToast({ message: "Dueño vinculado correctamente.", type: "success" });
            await cargarMascotas();
          }}
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
    </div>
  );
};

export default MascotasPage;
