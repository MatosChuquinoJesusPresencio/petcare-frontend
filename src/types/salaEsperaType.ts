export interface SalaEsperaRequest {
  appointmentId: number;
  observations?: string;
}

export interface SalaEsperaEstadoRequest {
  status: string;
}

export interface SalaEsperaResponse {
  id: number;
  appointmentId: number;
  petId: number;
  arrivalDate: string;
  status: string;
  observations: string;
}
