export interface MascotaAlertaResponse {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  alergias: string | null;
  enfermedadesCronicas: string | null;
  alertasMedicas: string | null;
  notasMedicas: string | null;
  tieneAlertas: boolean;
}
