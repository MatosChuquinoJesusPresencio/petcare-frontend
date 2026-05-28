import { Navigate } from "react-router-dom";

import Clientes from "../pages/Clientes"; // 1. Importas tu nueva página de Dueños

export const routes = [
  {
    path: "/",
    element: <Navigate to="/clientes" replace />,
  },
  {
    path: "/clientes",
    element: <Clientes />,
  },
];