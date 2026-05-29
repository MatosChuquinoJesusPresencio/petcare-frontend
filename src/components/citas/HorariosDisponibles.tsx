import { useEffect, useState } from "react";

import { obtenerDisponibilidad } from "../../services";

interface HorariosDisponiblesProps {
  vetId: number | null;
  serviceId: number | null;
  fecha: string;
  value: string;
  onChange: (hora: string) => void;
}

export default function HorariosDisponibles({
  vetId,
  serviceId,
  fecha,
  value,
  onChange,
}: HorariosDisponiblesProps) {
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t0 = setTimeout(() => onChange(""));
    const t1 = setTimeout(() => setSlots([]));

    if (!vetId || !fecha || !serviceId) {
      return () => { clearTimeout(t0); clearTimeout(t1); };
    }

    const t2 = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await obtenerDisponibilidad(vetId, fecha, serviceId);
        setSlots(data.horariosDisponibles);
      } catch {
        setSlots([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vetId, fecha, serviceId]);

  if (!vetId || !fecha || !serviceId) {
    return (
      <p className="text-muted small mb-0">
        Seleccione veterinario, servicio y fecha para ver horarios disponibles.
      </p>
    );
  }

  if (loading) {
    return <p className="text-muted small mb-0">Cargando horarios...</p>;
  }

  if (slots.length === 0) {
    return (
      <p className="text-danger small mb-0">
        No hay horarios disponibles para esta fecha.
      </p>
    );
  }

  return (
    <div className="d-flex flex-wrap gap-2">
      {slots.map((h) => (
        <button
          key={h}
          type="button"
          className={`btn btn-sm ${value === h ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => onChange(h)}
        >
          {h.substring(0, 5)}
        </button>
      ))}
    </div>
  );
}
