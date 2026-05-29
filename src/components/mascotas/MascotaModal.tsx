import { useEffect, useState } from "react";

import NotificationToast from "../NotificationToast";
import type { ToastInfo } from "../NotificationToast";

import { SEXOS_MASCOTA, SEXO_LABEL } from "../../constants";
import type { Dueno, MascotaRequest } from "../../types";
import {
  actualizarMascota,
  crearMascota,
  getDuenos,
  obtenerMascotaPorId,
} from "../../services";

interface Props {
  show: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  mascotaId?: number | null;
}

interface FormState {
  nombre: string;
  especie: string;
  raza: string;
  sexo: string;
  fechaNacimiento: string;
  microchip: string;
  condicionReproductiva: string;
  alergias: string;
  enfermedadesCronicas: string;
  alertasMedicas: string;
  ownerId: number;
  ownerRelation: string;
}

const initialForm: FormState = {
  nombre: "",
  especie: "",
  raza: "",
  sexo: SEXOS_MASCOTA[0],
  fechaNacimiento: "",
  microchip: "",
  condicionReproductiva: "",
  alergias: "",
  enfermedadesCronicas: "",
  alertasMedicas: "",
  ownerId: 0,
  ownerRelation: "Propietario",
};

export default function MascotaModal({
  show,
  onClose,
  onSuccess,
  mascotaId,
}: Props) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [duenos, setDuenos] = useState<Dueno[]>([]);
  const [toast, setToast] = useState<ToastInfo | null>(null);

  const cargarDuenos = async () => {
    try {
      const data = await getDuenos({ soloActivos: true });
      setDuenos(data);
    } catch (error) {
      console.error(error);
    }
  };

  const cargarMascota = async () => {
    try {
      const mascota = await obtenerMascotaPorId(mascotaId!);
      setForm((prev) => ({
        ...prev,
        nombre: mascota.nombre,
        especie: mascota.especie,
        raza: mascota.raza,
        sexo: mascota.sexo,
        fechaNacimiento: mascota.fechaNacimiento,
        microchip: mascota.microchip || "",
        condicionReproductiva: mascota.condicionReproductiva || "",
        alergias: mascota.alergias || "",
        enfermedadesCronicas: mascota.enfermedadesCronicas || "",
        alertasMedicas: mascota.alertasMedicas || "",
      }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const t = setTimeout(cargarDuenos);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => {
      if (mascotaId) {
        cargarMascota();
      } else {
        setForm(initialForm);
      }
    });
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, mascotaId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isCreating = !mascotaId;

    if (isCreating && !form.ownerId) {
      setToast({ message: "Debes seleccionar un dueño principal.", type: "error" });
      return;
    }

    try {
      const data: MascotaRequest = {
        name: form.nombre,
        species: form.especie,
        breed: form.raza,
        gender: form.sexo.toUpperCase(),
        birthDate: form.fechaNacimiento,
        microchip: form.microchip || undefined,
        reproductiveCondition: form.condicionReproductiva || undefined,
        allergies: form.alergias || undefined,
        chronicDiseases: form.enfermedadesCronicas || undefined,
        medicalAlerts: form.alertasMedicas || undefined,
        ownerId: isCreating ? form.ownerId : 0,
        ownerRelation: isCreating ? form.ownerRelation : "",
      };

      if (mascotaId) {
        await actualizarMascota(mascotaId, data);
      } else {
        await crearMascota(data);
      }

      await onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      setToast({ message: "No se pudo guardar la mascota.", type: "error" });
    }
  };

  if (!show) return null;

  const isEditing = !!mascotaId;

  return (
    <>
    <NotificationToast toast={toast} onClose={() => setToast(null)} />
    <div
      id="mascotaModal"
      className="modal d-block modal-bg"
    >
      <div className="modal-dialog modal-lg modal-force-dark-text">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {isEditing ? "Editar Mascota" : "Nueva Mascota"}
            </h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Especie</label>
                  <input
                    type="text"
                    className="form-control"
                    name="especie"
                    value={form.especie}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Raza</label>
                  <input
                    type="text"
                    className="form-control"
                    name="raza"
                    value={form.raza}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Sexo</label>
                  <select
                    className="form-select"
                    value={form.sexo}
                    onChange={(e) => setForm({ ...form, sexo: e.target.value })}
                  >
                    {SEXOS_MASCOTA.map((sexo) => (
                      <option key={sexo} value={sexo}>{SEXO_LABEL[sexo]}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Fecha Nacimiento</label>
                  <input
                    type="date"
                    className="form-control"
                    name="fechaNacimiento"
                    value={form.fechaNacimiento}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Dueño Principal</label>
                  <select
                    className="form-select"
                    value={form.ownerId}
                    onChange={(e) =>
                      setForm({ ...form, ownerId: Number(e.target.value) })
                    }
                    required={!isEditing}
                  >
                    <option value="">
                      {isEditing
                        ? "No cambiar dueño (opcional)"
                        : "Seleccione dueño"}
                    </option>
                    {duenos.map((dueno) => (
                      <option key={dueno.id} value={dueno.id}>
                        {dueno.nombre} {dueno.apellido}
                      </option>
                    ))}
                  </select>
                  {isEditing && (
                    <small className="text-muted">
                      El dueño principal no se modifica desde aquí. Usa "Vincular Dueño" para agregar owners adicionales.
                    </small>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Relación</label>
                  <input
                    type="text"
                    className="form-control"
                    name="ownerRelation"
                    value={form.ownerRelation}
                    onChange={handleChange}
                    required={!isEditing}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Microchip</label>
                  <input
                    type="text"
                    className="form-control"
                    name="microchip"
                    value={form.microchip}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Condición Reproductiva</label>
                  <input
                    type="text"
                    className="form-control"
                    name="condicionReproductiva"
                    value={form.condicionReproductiva}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Alergias</label>
                  <input
                    type="text"
                    className="form-control"
                    name="alergias"
                    value={form.alergias}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Enfermedades Crónicas</label>
                  <input
                    type="text"
                    className="form-control"
                    name="enfermedadesCronicas"
                    value={form.enfermedadesCronicas}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Alertas Médicas</label>
                  <input
                    type="text"
                    className="form-control"
                    name="alertasMedicas"
                    value={form.alertasMedicas}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                {isEditing ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}
