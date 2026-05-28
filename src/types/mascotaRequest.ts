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