import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Interfaces basadas en los requerimientos del backend
export interface Mascota {
  id: number;
  nombre: string;
  especie?: string;
  raza?: string;
  sexo?: string;
  fechaNacimiento?: string;
  microchip?: string;
  condicionReproductiva?: string;
  alergias?: string;
  enfermedadesCronicas?: string;
  alertasMedicas?: string;
  activo?: boolean;
}

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  dni?: string;
  email?: string;
}

export interface Servicio {
  id: number;
  nombre: string;
  descripcion?: string;
  duracionMinutos?: number;
  costoReferencial?: number;
  activo?: boolean;
}

export interface Cita {
  id: number;
  mascota: Mascota;
  veterinario: Usuario;
  servicio: Servicio;
  fechaHora: string;
  estado: string;
  notas: string;
  creadoPor?: Usuario;
  creadoEn?: string;
  actualizadoEn?: string;
}

// Interfaz para respuestas paginadas del backend (Page<T>)
export interface PageResponse<T> {
  content: T[];
  pageable: any;
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

const Citas: React.FC = () => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  // Mock de veterinarios ya que no hay endpoint específico según el documento
  const [veterinarios, setVeterinarios] = useState<Usuario[]>([
    { id: 1, nombre: 'Juan', apellido: 'Pérez' },
    { id: 2, nombre: 'Ana', apellido: 'Gómez' }
  ]);

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showReprogramarModal, setShowReprogramarModal] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    petId: '',
    veterinarianId: '',
    serviceId: '',
    dateTime: '',
    notes: ''
  });

  const [reprogramarDate, setReprogramarDate] = useState('');

  // Config axios
  const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Ajusta según tu backend
    withCredentials: true
  });

  const fetchCitas = async () => {
    try {
      setLoading(true);
      const res = await api.get('/citas');
      // Ajustar dependiendo si viene paginado (res.data.content o res.data)
      setCitas(res.data.content || res.data || []);
    } catch (error) {
      console.error('Error fetching citas', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMascotasYServicios = async () => {
    try {
      const [mascotasRes, serviciosRes] = await Promise.all([
        api.get('/mascotas'),
        api.get('/servicios?soloActivos=true')
      ]);
      setMascotas(mascotasRes.data.content || mascotasRes.data || []);
      setServicios(serviciosRes.data.content || serviciosRes.data || []);
    } catch (error) {
      console.error('Error fetching dependencias', error);
    }
  };

  useEffect(() => {
    fetchCitas();
    fetchMascotasYServicios();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAgendar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/citas', {
        petId: Number(formData.petId),
        veterinarianId: Number(formData.veterinarianId),
        serviceId: Number(formData.serviceId),
        dateTime: formData.dateTime,
        notes: formData.notes
      });
      setShowModal(false);
      fetchCitas();
    } catch (error) {
      console.error('Error agendando cita', error);
      alert('Error al agendar la cita');
    }
  };

  const handleEstadoChange = async (id: number, nuevoEstado: string) => {
    try {
      await api.put(`/citas/${id}/estado`, { status: nuevoEstado });
      fetchCitas();
    } catch (error) {
      console.error('Error cambiando estado', error);
      alert('Error al cambiar el estado');
    }
  };

  const handleReprogramar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!citaSeleccionada) return;
    try {
      await api.put(`/citas/${citaSeleccionada.id}/reprogramar`, { dateTime: reprogramarDate });
      setShowReprogramarModal(false);
      fetchCitas();
    } catch (error) {
      console.error('Error reprogramando', error);
      alert('Error al reprogramar la cita');
    }
  };

  const handleCancelar = async (id: number) => {
    if (!window.confirm('¿Está seguro de cancelar esta cita?')) return;
    try {
      await api.delete(`/citas/${id}`);
      fetchCitas();
    } catch (error) {
      console.error('Error cancelando', error);
      alert('Error al cancelar la cita');
    }
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'PROGRAMADA': return 'bg-primary';
      case 'CONFIRMADA': return 'bg-success';
      case 'ATENDIDA': return 'bg-info';
      case 'NO_ASISTIDA': return 'bg-warning text-dark';
      case 'CANCELADA': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="bi bi-calendar-check me-2"></i>Gestión de Citas</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
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
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Fecha y Hora</th>
                    <th>Mascota</th>
                    <th>Veterinario</th>
                    <th>Servicio</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {citas.map(cita => (
                    <tr key={cita.id}>
                      <td>{new Date(cita.fechaHora).toLocaleString()}</td>
                      <td>{cita.mascota?.nombre}</td>
                      <td>{cita.veterinario?.nombre} {cita.veterinario?.apellido}</td>
                      <td>{cita.servicio?.nombre}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(cita.estado)}`}>
                          {cita.estado}
                        </span>
                      </td>
                      <td>
                        <div className="dropdown d-inline-block me-2">
                          <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Estado
                          </button>
                          <ul className="dropdown-menu">
                            <li><button className="dropdown-item" onClick={() => handleEstadoChange(cita.id, 'CONFIRMADA')}>Confirmar</button></li>
                            <li><button className="dropdown-item" onClick={() => handleEstadoChange(cita.id, 'ATENDIDA')}>Atendida</button></li>
                            <li><button className="dropdown-item" onClick={() => handleEstadoChange(cita.id, 'NO_ASISTIDA')}>No Asistió</button></li>
                          </ul>
                        </div>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => {
                          setCitaSeleccionada(cita);
                          setReprogramarDate(cita.fechaHora.substring(0, 16));
                          setShowReprogramarModal(true);
                        }} title="Reprogramar">
                          <i className="bi bi-clock-history"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleCancelar(cita.id)} title="Cancelar">
                          <i className="bi bi-x-circle"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {citas.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-muted">No hay citas registradas.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Nueva Cita */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agendar Nueva Cita</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form id="formCita" onSubmit={handleAgendar}>
                  <div className="mb-3">
                    <label className="form-label">Mascota *</label>
                    <select className="form-select" name="petId" value={formData.petId} onChange={handleInputChange} required>
                      <option value="">Seleccione mascota...</option>
                      {mascotas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Veterinario *</label>
                    <select className="form-select" name="veterinarianId" value={formData.veterinarianId} onChange={handleInputChange} required>
                      <option value="">Seleccione veterinario...</option>
                      {veterinarios.map(v => <option key={v.id} value={v.id}>{v.nombre} {v.apellido}</option>)}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Servicio *</label>
                    <select className="form-select" name="serviceId" value={formData.serviceId} onChange={handleInputChange} required>
                      <option value="">Seleccione servicio...</option>
                      {servicios.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Fecha y Hora *</label>
                    <input type="datetime-local" className="form-control" name="dateTime" value={formData.dateTime} onChange={handleInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Notas</label>
                    <textarea className="form-control" name="notes" rows={3} value={formData.notes} onChange={handleInputChange}></textarea>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cerrar</button>
                <button type="submit" form="formCita" className="btn btn-primary">Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Reprogramar Cita */}
      {showReprogramarModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reprogramar Cita</h5>
                <button type="button" className="btn-close" onClick={() => setShowReprogramarModal(false)}></button>
              </div>
              <div className="modal-body">
                <form id="formReprogramar" onSubmit={handleReprogramar}>
                  <div className="mb-3">
                    <label className="form-label">Nueva Fecha y Hora *</label>
                    <input type="datetime-local" className="form-control" value={reprogramarDate} onChange={(e) => setReprogramarDate(e.target.value)} required />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowReprogramarModal(false)}>Cancelar</button>
                <button type="submit" form="formReprogramar" className="btn btn-primary">Reprogramar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Citas;
