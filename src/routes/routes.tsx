import { Navigate } from "react-router-dom";

import Servicios from "../pages/Servicios";

export const routes = [
  {
    path: "/",
    element: <Navigate to="/servicios" replace />,
  },
  {
    path: "/servicios",
    element: < Servicios/>,
  },
];
