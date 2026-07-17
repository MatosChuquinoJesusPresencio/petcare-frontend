export interface NotificacionResponse {
  id: number;
  tipo: string;
  destinoUsuarioId: number;
  mascotaId: number;
  citaId: number;
  canal: string;
  mensaje: string;
  estado: string;
  fechaEnvio: string;
  errorMensaje: string;
  leido: boolean;
  creadoEn: string;
}
