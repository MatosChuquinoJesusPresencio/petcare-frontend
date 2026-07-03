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
        setSlots(data.availableSlots);
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
      <p style={{ fontSize: 'var(--tamano-sm)', color: 'var(--color-texto-claro)', margin: 0 }}>
        Seleccione veterinario, servicio y fecha para ver horarios disponibles.
      </p>
    );
  }

  if (loading) {
    return <p style={{ fontSize: 'var(--tamano-sm)', color: 'var(--color-texto-claro)', margin: 0 }}>Cargando horarios...</p>;
  }

  if (slots.length === 0) {
    return (
      <p style={{ fontSize: 'var(--tamano-sm)', color: 'var(--color-peligro)', margin: 0 }}>
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
          className={`boton boton--pequeno ${value === h ? 'boton--primario' : 'boton--borde'}`}
          onClick={() => onChange(h)}
        >
          {h.substring(0, 5)}
        </button>
      ))}
    </div>
  );
}
