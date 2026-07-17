export interface DashboardResumen {
  citasHoy: number;
  pacientesEnEspera: number;
  atencionesCompletadas: number;
  vacunasProximas: number;
  cancelacionesHoy: number;
  serviciosTop: ServicioTop[];
  citasPorEstado: CitasPorEstado[];
}

export interface ServicioTop {
  nombre: string;
  cantidad: number;
}

export interface CitasPorEstado {
  estado: string;
  cantidad: number;
}
