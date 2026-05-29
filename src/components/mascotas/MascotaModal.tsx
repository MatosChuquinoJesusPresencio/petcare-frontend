import { useEffect, useState } from "react";

import NotificationToast from "../common/NotificationToast";
import type { ToastInfo } from "../common/NotificationToast";

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

function validate(form: FormState, isCreating: boolean): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!form.nombre.trim()) {
    errors.nombre = "El nombre es obligatorio.";
  } else if (form.nombre.trim().length < 2) {
    errors.nombre = "Mínimo 2 caracteres.";
  } else if (form.nombre.trim().length > 50) {
    errors.nombre = "Máximo 50 caracteres.";
  }

  if (!form.especie.trim()) {
    errors.especie = "La especie es obligatoria.";
  } else if (form.especie.trim().length < 2) {
    errors.especie = "Mínimo 2 caracteres.";
  } else if (form.especie.trim().length > 50) {
    errors.especie = "Máximo 50 caracteres.";
  }

  if (!form.raza.trim()) {
    errors.raza = "La raza es obligatoria.";
  } else if (form.raza.trim().length < 2) {
    errors.raza = "Mínimo 2 caracteres.";
  } else if (form.raza.trim().length > 50) {
    errors.raza = "Máximo 50 caracteres.";
  }

  if (!form.fechaNacimiento) {
    errors.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
  } else {
    const nacimiento = new Date(form.fechaNacimiento);
    const hoy = new Date();
    hoy.setHours(23, 59, 59, 999);
    if (nacimiento > hoy) {
      errors.fechaNacimiento = "La fecha no puede ser futura.";
    }
  }

  if (isCreating && !form.ownerId) {
    errors.ownerId = "Selecciona un dueño principal.";
  }

  if (isCreating) {
    if (!form.ownerRelation.trim()) {
      errors.ownerRelation = "La relación es obligatoria.";
    } else if (form.ownerRelation.trim().length < 2) {
      errors.ownerRelation = "Mínimo 2 caracteres.";
    } else if (form.ownerRelation.trim().length > 50) {
      errors.ownerRelation = "Máximo 50 caracteres.";
    }
  }

  if (form.microchip && form.microchip.length > 50) {
    errors.microchip = "Máximo 50 caracteres.";
  }

  if (form.condicionReproductiva && form.condicionReproductiva.length > 100) {
    errors.condicionReproductiva = "Máximo 100 caracteres.";
  }

  if (form.alergias && form.alergias.length > 500) {
    errors.alergias = "Máximo 500 caracteres.";
  }

  if (form.enfermedadesCronicas && form.enfermedadesCronicas.length > 500) {
    errors.enfermedadesCronicas = "Máximo 500 caracteres.";
  }

  if (form.alertasMedicas && form.alertasMedicas.length > 500) {
    errors.alertasMedicas = "Máximo 500 caracteres.";
  }

  return errors;
}

export default function MascotaModal({
  show,
  onClose,
  onSuccess,
  mascotaId,
}: Props) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [duenos, setDuenos] = useState<Dueno[]>([]);
  const [toast, setToast] = useState<ToastInfo | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
      setFieldErrors({});
    });
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, mascotaId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isCreating = !mascotaId;

    const errors = validate(form, isCreating);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

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
                    className={`form-control ${fieldErrors.nombre ? 'is-invalid' : ''}`}
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                  />
                  {fieldErrors.nombre && <div className="invalid-feedback">{fieldErrors.nombre}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Especie</label>
                  <input
                    type="text"
                    className={`form-control ${fieldErrors.especie ? 'is-invalid' : ''}`}
                    name="especie"
                    value={form.especie}
                    onChange={handleChange}
                    required
                  />
                  {fieldErrors.especie && <div className="invalid-feedback">{fieldErrors.especie}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Raza</label>
                  <input
                    type="text"
                    className={`form-control ${fieldErrors.raza ? 'is-invalid' : ''}`}
                    name="raza"
                    value={form.raza}
                    onChange={handleChange}
                    required
                  />
                  {fieldErrors.raza && <div className="invalid-feedback">{fieldErrors.raza}</div>}
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
                    className={`form-control ${fieldErrors.fechaNacimiento ? 'is-invalid' : ''}`}
                    name="fechaNacimiento"
                    value={form.fechaNacimiento}
                    onChange={handleChange}
                    required
                  />
                  {fieldErrors.fechaNacimiento && <div className="invalid-feedback">{fieldErrors.fechaNacimiento}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Dueño Principal</label>
                  <select
                    className={`form-select ${fieldErrors.ownerId ? 'is-invalid' : ''}`}
                    value={form.ownerId}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, ownerId: Number(e.target.value) }));
                      setFieldErrors((p) => { const n = { ...p }; delete n.ownerId; return n; });
                    }}
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
                  {fieldErrors.ownerId && <div className="invalid-feedback">{fieldErrors.ownerId}</div>}
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
                    className={`form-control ${fieldErrors.ownerRelation ? 'is-invalid' : ''}`}
                    name="ownerRelation"
                    value={form.ownerRelation}
                    onChange={handleChange}
                    required={!isEditing}
                  />
                  {fieldErrors.ownerRelation && <div className="invalid-feedback">{fieldErrors.ownerRelation}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Microchip</label>
                  <input
                    type="text"
                    className={`form-control ${fieldErrors.microchip ? 'is-invalid' : ''}`}
                    name="microchip"
                    value={form.microchip}
                    onChange={handleChange}
                  />
                  {fieldErrors.microchip && <div className="invalid-feedback">{fieldErrors.microchip}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Condición Reproductiva</label>
                  <input
                    type="text"
                    className={`form-control ${fieldErrors.condicionReproductiva ? 'is-invalid' : ''}`}
                    name="condicionReproductiva"
                    value={form.condicionReproductiva}
                    onChange={handleChange}
                  />
                  {fieldErrors.condicionReproductiva && <div className="invalid-feedback">{fieldErrors.condicionReproductiva}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Alergias</label>
                  <input
                    type="text"
                    className={`form-control ${fieldErrors.alergias ? 'is-invalid' : ''}`}
                    name="alergias"
                    value={form.alergias}
                    onChange={handleChange}
                  />
                  {fieldErrors.alergias && <div className="invalid-feedback">{fieldErrors.alergias}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Enfermedades Crónicas</label>
                  <input
                    type="text"
                    className={`form-control ${fieldErrors.enfermedadesCronicas ? 'is-invalid' : ''}`}
                    name="enfermedadesCronicas"
                    value={form.enfermedadesCronicas}
                    onChange={handleChange}
                  />
                  {fieldErrors.enfermedadesCronicas && <div className="invalid-feedback">{fieldErrors.enfermedadesCronicas}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Alertas Médicas</label>
                  <input
                    type="text"
                    className={`form-control ${fieldErrors.alertasMedicas ? 'is-invalid' : ''}`}
                    name="alertasMedicas"
                    value={form.alertasMedicas}
                    onChange={handleChange}
                  />
                  {fieldErrors.alertasMedicas && <div className="invalid-feedback">{fieldErrors.alertasMedicas}</div>}
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
