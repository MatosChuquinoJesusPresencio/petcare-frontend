import { useEffect, useState } from "react";

import type { CitaResponse, VeterinarioResponse } from "../types/citaType";
import type { MascotaResponse } from "../types/mascotaType";
import type { ServicioResponse } from "../types/servicioType";

import { obtenerCitas, cancelarCita, cambiarEstadoCita } from "../services/citaService";
import { obtenerMascotas } from "../services/mascotaService";
import { getServicios } from "../services/servicioService";
import { obtenerVeterinarios } from "../services/usuarioService";

import CitaTable from "../components/citas/CitaTable";
import CitaFormModal from "../components/citas/CitaFormModal";
import CitaReprogramarModal from "../components/citas/CitaReprogramarModal";
import ConfirmDialog from "../components/ConfirmDialog";

const CitasPage = () => {
  const [citas, setCitas] = useState<CitaResponse[]>([]);
  const [mascotas, setMascotas] = useState<MascotaResponse[]>([]);
  const [servicios, setServicios] = useState<ServicioResponse[]>([]);
  const [veterinarios, setVeterinarios] = useState<VeterinarioResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const [showFormModal, setShowFormModal] = useState(false);
  const [showReprogramarModal, setShowReprogramarModal] = useState(false);
  const [citaReprogramar, setCitaReprogramar] = useState<CitaResponse | null>(null);
  const [cancelarId, setCancelarId] = useState<number | null>(null);

  const fetchCitas = async () => {
    try {
      setLoading(true);
      const data = await obtenerCitas();
      setCitas(data);
    } catch (error) {
      console.error("Error fetching citas", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDependencias = async () => {
    try {
      const [mascotasData, serviciosData, veterinariosData] = await Promise.all([
        obtenerMascotas(),
        getServicios({ soloActivos: true }),
        obtenerVeterinarios(),
      ]);
      setMascotas(mascotasData);
      setServicios(serviciosData);
      setVeterinarios(veterinariosData);
    } catch (error) {
      console.error("Error fetching dependencias", error);
    }
  };

  useEffect(() => {
    fetchCitas();
    fetchDependencias();
  }, []);

  const handleEstadoChange = async (id: number, nuevoEstado: string) => {
    try {
      await cambiarEstadoCita(id, nuevoEstado);
      await fetchCitas();
    } catch (error) {
      console.error("Error cambiando estado", error);
      alert("Error al cambiar el estado");
    }
  };

  const handleCancelarConfirmado = async () => {
    if (cancelarId === null) return;
    try {
      await cancelarCita(cancelarId);
      await fetchCitas();
    } catch (error) {
      console.error("Error cancelando", error);
      alert("Error al cancelar la cita");
    } finally {
      setCancelarId(null);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="bi bi-calendar-check me-2"></i>Gestión de Citas</h2>
        <button className="btn btn-primary" onClick={() => setShowFormModal(true)}>
          <i className="bi bi-plus-circle me-2"></i>Nueva Cita
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <CitaTable
              citas={citas}
              onEstadoChange={handleEstadoChange}
              onReprogramar={(cita) => {
                setCitaReprogramar(cita);
                setShowReprogramarModal(true);
              }}
              onCancelar={(id) => setCancelarId(id)}
            />
          )}
        </div>
      </div>

      <CitaFormModal
        show={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSuccess={fetchCitas}
        mascotas={mascotas}
        servicios={servicios}
        veterinarios={veterinarios}
      />

      <CitaReprogramarModal
        show={showReprogramarModal}
        onClose={() => setShowReprogramarModal(false)}
        onSuccess={fetchCitas}
        cita={citaReprogramar}
      />

      <ConfirmDialog
        isOpen={cancelarId !== null}
        title="Cancelar cita"
        message="¿Estás seguro de cancelar esta cita?"
        confirmText="Cancelar cita"
        cancelText="Volver"
        variant="danger"
        onConfirm={handleCancelarConfirmado}
        onCancel={() => setCancelarId(null)}
      />
    </div>
  );
};

export default CitasPage;
