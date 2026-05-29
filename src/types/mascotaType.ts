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
  nombre: string;
  especie: string;
  raza: string;
  sexo: string;
  fechaNacimiento: string;
  microchip: string;
  condicionReproductiva: string;
  alergias: string;
  enfermedadesCronicas: string;
  alertasMedicas: string;
  activo: boolean;
}


