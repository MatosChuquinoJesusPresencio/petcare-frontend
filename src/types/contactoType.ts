export interface ContactoEmergencia {
  id: number;
  dueno: { id: number };
  nombre: string;
  telefono: string;
  relacion?: string;
}

export interface ContactoEmergenciaRequest {
  name: string;
  phone: string;
  relation?: string;
}
