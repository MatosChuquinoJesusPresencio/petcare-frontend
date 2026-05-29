import { useCallback, useEffect, useState } from "react";

import type { CitaResponse, MascotaResponse, ServicioResponse, VeterinarioResponse } from "../types";
import {
  cancelarCita,
  cambiarEstadoCita,
  getServicios,
  obtenerCitas,
  obtenerMascotas,
  obtenerVeterinarios,
} from "../services";

import CitaTable from "../components/citas/CitaTable";
import CitaFormModal from "../components/citas/CitaFormModal";
import CitaReprogramarModal from "../components/citas/CitaReprogramarModal";
import ConfirmDialog from "../components/common/ConfirmDialog";

import NotificationToast from "../components/common/NotificationToast";
import type { ToastInfo } from "../components/common/NotificationToast";

import PageHeader from "../components/common/PageHeader";

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

  const [toast, setToast] = useState<ToastInfo | null>(null);

  const fetchCitas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await obtenerCitas();
      setCitas(data);
    } catch (error) {
      console.error("Error fetching citas", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDependencias = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    const t1 = setTimeout(fetchCitas);
    const t2 = setTimeout(fetchDependencias);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [fetchCitas, fetchDependencias]);

  const handleEstadoChange = async (id: number, nuevoEstado: string) => {
    try {
      await cambiarEstadoCita(id, nuevoEstado);
      await fetchCitas();
      setToast({ message: "Estado de la cita actualizado correctamente.", type: "success" });
    } catch (error) {
      console.error("Error cambiando estado", error);
      setToast({ message: "Error al cambiar el estado", type: "error" });
    }
  };

  const handleCancelarConfirmado = async () => {
    if (cancelarId === null) return;
    try {
      await cancelarCita(cancelarId);
      await fetchCitas();
      setToast({ message: "Cita cancelada correctamente.", type: "success" });
    } catch (error) {
      console.error("Error cancelando", error);
      setToast({ message: "Error al cancelar la cita", type: "error" });
    } finally {
      setCancelarId(null);
    }
  };

  return (
    <div className="container mt-4">
      <NotificationToast toast={toast} onClose={() => setToast(null)} />

      <PageHeader icon="bi-calendar-check" title="Gestión de Citas" description="Vista donde podras ver y gestionar las citas">
        <button className="btn btn-success" onClick={() => setShowFormModal(true)}>
          <i className="bi bi-plus-circle-fill me-2"></i>Nueva Cita
        </button>
      </PageHeader>

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
        <div className="card-footer text-muted small py-2">
          Total de citas: {citas.length}
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
