export interface HistorialTransferenciaResponse {
  id: number;
  petId: number;
  previousOwnerId: number | null;
  newOwnerId: number;
  date: string;
  reason: string;
  responsibleUserId: number;
}
