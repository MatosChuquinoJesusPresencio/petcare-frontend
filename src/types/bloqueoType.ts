export interface BloqueoRequest {
  veterinarianId: number;
  date: string;
  startTime: string;
  endTime: string;
  reason?: string;
}

export interface BloqueoVeterinarioResponse {
  id: number;
  veterinarianId: number;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
}
