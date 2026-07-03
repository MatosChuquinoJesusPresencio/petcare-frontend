export interface CitaResponse {
  id: number;
  petId: number;
  veterinarianId: number;
  serviceId: number;
  dateTime: string;
  status: string;
  notes: string;
  createdBy: number;
  createdAt: string;
  updatedBy?: number;
  updatedAt: string;
}

export interface CitaRequest {
  petId: number;
  veterinarianId: number;
  serviceId: number;
  dateTime: string;
  notes?: string;
}

export interface CitaEstadoRequest {
  status: string;
}

export interface CitaReprogramarRequest {
  dateTime: string;
}

export interface DisponibilidadResponse {
  veterinarianId: number;
  date: string;
  durationMinutes: number;
  availableSlots: string[];
}
