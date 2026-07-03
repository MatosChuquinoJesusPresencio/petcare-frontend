export interface ContactoEmergencia {
  id: number;
  ownerId: number;
  name: string;
  phone: string;
  relation?: string;
}

export interface ContactoEmergenciaRequest {
  name: string;
  phone: string;
  relation?: string;
}
