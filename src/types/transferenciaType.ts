export interface HistorialTransferenciaResponse {
  id: number;
  petId: number;
  previousOwnerId: number;
  newOwnerId: number;
  date: string;
  reason: string;
  responsibleUserId: number;
}
