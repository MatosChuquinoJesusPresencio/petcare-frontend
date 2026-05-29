import { useEffect, useState } from "react";

import {
  crearMascota,
  actualizarMascota,
  obtenerMascotaPorId,
} from "../../services/mascotaService.ts";

import type { MascotaRequest } from "../../types/mascotaRequest.ts";
import type { Dueno } from "../../types/dueno.ts";
import { obtenerDuenos } from "../../services/duenoService.ts";

interface Props {
  show: boolean;

  onClose: () => void;

  onSuccess: () => Promise<void>;

  mascotaId?: number | null;
}

export default function MascotaModal({
  show,
  onClose,
  onSuccess,
  mascotaId,
}: Props) {
  const [form, setForm] = useState({
    nombre: "",
    especie: "",
    raza: "",
    sexo: "MACHO",
    fechaNacimiento: "",

    microchip: "",
    condicionReproductiva: "",
    alergias: "",
    enfermedadesCronicas: "",
    alertasMedicas: "",

    ownerId: 0,
    ownerRelation: "Propietario",
  });
  const [duenos, setDuenos] = useState<Dueno[]>([]);
  useEffect(() => {
    cargarDuenos();
  }, []);
  useEffect(() => {
    if (!show) return;

    if (mascotaId) {
      cargarMascota();
    } else {
      limpiarFormulario();
    }
  }, [show, mascotaId]);

  const cargarMascota = async () => {
    try {
      const mascota = await obtenerMascotaPorId(mascotaId!);

      setForm({
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

        ownerId: 1,
        ownerRelation: "Propietario",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const limpiarFormulario = () => {
    setForm({
      nombre: "",
      especie: "",
      raza: "",
      sexo: "MACHO",
      fechaNacimiento: "",

      microchip: "",
      condicionReproductiva: "",
      alergias: "",
      enfermedadesCronicas: "",
      alertasMedicas: "",

      ownerId: 0,
      ownerRelation: "Propietario",
    });
  };
  const cargarDuenos = async () => {
    try {
      const data = await obtenerDuenos();

      setDuenos(data.content);
    } catch (error) {
      console.error(error);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        ownerId: form.ownerId,
        ownerRelation: form.ownerRelation,
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
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal d-block"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mascotaId ? "Editar Mascota" : "Nueva Mascota"}
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
                    name="sexo"
                    value={form.sexo}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        sexo: e.target.value,
                      })
                    }
                  >
                    <option value="MACHO">MACHO</option>
                    <option value="HEMBRA">HEMBRA</option>
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
                      setForm({
                        ...form,
                        ownerId: Number(e.target.value),
                      })
                    }
                    required
                  >
                    <option value="">Seleccione dueño</option>

                    {duenos.map((dueno) => (
                      <option key={dueno.id} value={dueno.id}>
                        {dueno.nombre} {dueno.apellido}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Relación</label>

                  <input
                    type="text"
                    className="form-control"
                    name="ownerRelation"
                    value={form.ownerRelation}
                    onChange={handleChange}
                    required
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
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancelar
              </button>

              <button type="submit" className="btn btn-primary">
                {mascotaId ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
