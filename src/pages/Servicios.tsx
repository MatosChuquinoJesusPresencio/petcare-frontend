import { useEffect, useState } from "react";

import { getServicios } from "../services/servicioApi";
import type { ServicioResponse } from "../types/servicios";

const Servicios = () => {
  const [servicios, setServicios] = useState<ServicioResponse[]>([]);

  useEffect(() => {
    async function cargarServicios() {
      try {
        const data = await getServicios();
        setServicios(data);
        console.log("Servicios en componente:", data);
      } catch (error) {
        console.error("Error al cargar servicios:", error);
      }
    }

    cargarServicios();
  }, []);

  return (
    <div>
      <h1>Bienvenido a Servicios</h1>
      <p>Total de servicios cargados: {servicios.length}</p>
    </div>
  );
};

export default Servicios;
