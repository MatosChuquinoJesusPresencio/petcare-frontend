export interface AtencionClinicaRequest {
  appointmentId: number;
  reasonForConsultation: string;
  symptoms?: string;
  diagnosis: string;
  clinicalObservations?: string;
  treatment?: string;
  triageId: number;
}

export interface AtencionClinicaResponse {
  id: number;
  appointmentId: number;
  petId: number;
  veterinarianId: number;
  triageId?: number;
  reasonForConsultation: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  clinicalObservations: string;
  createdBy: number;
  createdAt: string;
  updatedBy?: number;
  updatedAt: string;
}
