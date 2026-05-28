import { useEffect, useState } from "react";

import type { Mascota } from "../types/mascota";

import { obtenerMascotas, eliminarMascota } from "../services/mascotaService";

import MascotaTable from "../components/mascotas/MascotaTable";
import MascotaModal from "../components/mascotas/MascotaModal";
import MascotaVincularModal from "../components/mascotas/MascotaVincularModal";

export default function Mascotas() {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);

  const [showModal, setShowModal] = useState(false);

  const [mascotaEditarId, setMascotaEditarId] = useState<number | null>(null);

  const [showVincularModal, setShowVincularModal] = useState(false);

  const [mascotaVincularId, setMascotaVincularId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    cargarMascotas();
  }, []);

  const cargarMascotas = async () => {
    try {
      const data = await obtenerMascotas();

      setMascotas(data.content);
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

  const handleEliminar = async (id: number) => {
    const confirmar = window.confirm("¿Desactivar mascota?");

    if (!confirmar) return;

    try {
      await eliminarMascota(id);

      await cargarMascotas();
    } catch (error) {
      console.error(error);
    }
  };

  const handleVincular = (id: number) => {
    setMascotaVincularId(id);

    setShowVincularModal(true);
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm mb-4">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h1 className="mb-1">Mascotas</h1>

            <p className="text-muted mb-0">
              Vista donde podrás revisar y gestionar mascotas
            </p>
          </div>

          <button className="btn btn-success" onClick={handleNuevaMascota}>
            +
          </button>
        </div>
      </div>

      <MascotaTable
        mascotas={mascotas}
        onEdit={handleEditar}
        onDelete={handleEliminar}
        onVincular={handleVincular}
      />

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
    </div>
  );
}
