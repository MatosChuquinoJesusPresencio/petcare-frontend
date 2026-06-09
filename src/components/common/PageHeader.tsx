import type { ReactNode } from "react";

interface PageHeaderProps {
  icon?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}

export default function PageHeader({ icon, title, description, children }: PageHeaderProps) {
  return (
    <div className="encabezado-pagina">
      <div className="encabezado-pagina-info">
        <h1 className="encabezado-pagina-titulo">
          {icon && <i className={`bi ${icon}`}></i>}
          {title}
        </h1>
        {description && <p className="encabezado-pagina-descripcion">{description}</p>}
      </div>
      {children && <div className="encabezado-pagina-acciones">{children}</div>}
    </div>
  );
}
