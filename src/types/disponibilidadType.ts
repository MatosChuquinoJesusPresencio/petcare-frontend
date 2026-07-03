export interface DisponibilidadRequest {
  veterinarianId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface DisponibilidadVeterinarioResponse {
  id: number;
  veterinarianId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  active: boolean;
}
