import { useEffect, useState } from "react";
import { dashboardService } from "../services";
import type { DashboardResumen } from "../types";
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const PIE_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

const STAT_CARDS = [
  { key: "citasHoy" as const, label: "Citas Hoy", icon: "bi-calendar-check", bg: "bg-blue-600", ring: "ring-blue-200" },
  { key: "pacientesEnEspera" as const, label: "En Espera", icon: "bi-hourglass-split", bg: "bg-amber-500", ring: "ring-amber-200" },
  { key: "atencionesCompletadas" as const, label: "Completadas", icon: "bi-check-circle-fill", bg: "bg-emerald-600", ring: "ring-emerald-200" },
  { key: "vacunasProximas" as const, label: "Vacunas Proximas", icon: "bi-shield-plus", bg: "bg-violet-600", ring: "ring-violet-200" },
  { key: "cancelacionesHoy" as const, label: "Canceladas", icon: "bi-x-circle-fill", bg: "bg-rose-600", ring: "ring-rose-200" },
] as const;

export default function DashboardPage() {
  const [resumen, setResumen] = useState<DashboardResumen | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .obtenerResumen()
      .then(setResumen)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: 48, height: 48 }} />
          <p className="text-gray-500">Cargando dashboard...</p>
        </div>
      </div>
    );

  if (!resumen)
    return (
      <div className="p-6">
        <div className="alert alert-danger">Error al cargar el dashboard</div>
      </div>
    );

  const sortedServicios = [...resumen.serviciosTop].sort((a, b) => b.cantidad - a.cantidad);
  const sortedEstados = [...resumen.citasPorEstado].sort((a, b) => b.cantidad - a.cantidad);

  return (
    <div className="contenedor-pagina">
      <div className="container">
        <div className="d-flex align-items-center mb-4 animacion-entrada">
          <i className="bi bi-grid-1x2-fill fs-2 me-3" style={{ color: "var(--color-primario)" }} />
          <div>
            <h1 className="fs-4 fw-bold mb-0">Dashboard Operativo</h1>
            <small className="text-muted">Resumen del dia en tiempo real</small>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="row g-3 mb-4 animacion-entrada" style={{ animationDelay: "0.05s" }}>
          {STAT_CARDS.map((card) => (
            <div key={card.key} className="col-6 col-md-4 col-lg">
              <div className={`card border-0 shadow-sm h-100 ${card.ring}`} style={{ borderLeft: `4px solid var(--color-primario)` }}>
                <div className="card-body d-flex align-items-center">
                  <div className={`${card.bg} rounded-3 d-flex align-items-center justify-content-center me-3`} style={{ width: 48, height: 48 }}>
                    <i className={`bi ${card.icon} text-white fs-5`} />
                  </div>
                  <div>
                    <p className="text-muted small mb-0">{card.label}</p>
                    <p className="fs-4 fw-bold mb-0">{resumen[card.key]}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="row g-4 animacion-entrada" style={{ animationDelay: "0.1s" }}>
          {/* Pie Chart */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-bottom">
                <h6 className="fw-semibold mb-0">
                  <i className="bi bi-pie-chart-fill me-2 text-primary" />
                  Citas por Estado
                </h6>
              </div>
              <div className="card-body d-flex align-items-center justify-content-center">
                {sortedEstados.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={sortedEstados}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={50}
                        dataKey="cantidad"
                        nameKey="estado"
                        label={({ estado, cantidad }) => `${estado}: ${cantidad}`}
                        labelLine
                        strokeWidth={2}
                        stroke="#fff"
                      >
                        {sortedEstados.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-muted">Sin datos disponibles</p>
                )}
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-bottom">
                <h6 className="fw-semibold mb-0">
                  <i className="bi bi-bar-chart-fill me-2 text-success" />
                  Servicios Mas Solicitados
                </h6>
              </div>
              <div className="card-body">
                {sortedServicios.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={sortedServicios} layout="vertical" margin={{ left: 20, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                      <YAxis dataKey="nombre" type="category" width={120} tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                        formatter={(value: number) => [`${value} citas`, "Cantidad"]}
                      />
                      <Bar dataKey="cantidad" fill="#10B981" radius={[0, 6, 6, 0]} barSize={28} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-muted">Sin datos disponibles</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
