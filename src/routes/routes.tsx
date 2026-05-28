import { Navigate } from "react-router-dom";

import Servicios from "../pages/Servicios";
import Mascotas from "../pages/Mascotas";

export const routes = [
  {
    path: "/",
    element: <Navigate to="/servicios" replace />,
  },
  {
    path: "/servicios",
    element: < Servicios/>,
  },
  {
  path: "/mascotas",
  element: <Mascotas />,
}
];
