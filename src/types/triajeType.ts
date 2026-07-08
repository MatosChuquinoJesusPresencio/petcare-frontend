export interface TriajeRequest {
  appointmentId: number;
  reasonForVisit: string;
  urgencyLevel: string;
  visibleSigns?: string;
  observations?: string;
  weight?: number;
  temperature?: number;
  heartRate?: number;
  respiratoryRate?: number;
}

export interface TriajeResponse {
  id: number;
  appointmentId: number;
  reasonForVisit: string;
  urgencyLevel: string;
  visibleSigns: string | null;
  observations: string | null;
  weight: number | null;
  temperature: number | null;
  heartRate: number | null;
  respiratoryRate: number | null;
  assistantId: number;
  createdAt: string;
  updatedAt: string;
}
