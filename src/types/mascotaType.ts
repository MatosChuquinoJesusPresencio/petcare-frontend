export interface MascotaRequest {
  name: string;
  species: string;
  breed: string;
  gender: string;
  birthDate: string;
  microchip?: string;
  reproductiveCondition?: string;
  allergies?: string;
  chronicDiseases?: string;
  medicalAlerts?: string;
  ownerId: number;
  ownerRelation: string;
}

export interface MascotaResponse {
  id: number;
  name: string;
  especie: string;
  breed: string;
  gender: string;
  dateOfBirth: string;
  microchip: string;
  reproductiveCondition: string;
  allergies: string;
  chronicDiseases: string;
  medicalAlerts: string;
  medicalNotes?: string;
  active: boolean;
}

export interface CambioDuenoPrincipalRequest {
  ownerId: number;
  relation: string;
  reason: string;
}
