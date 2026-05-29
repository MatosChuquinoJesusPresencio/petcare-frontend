import type { ReactNode } from "react";

interface PageHeaderProps {
  icon?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}

export default function PageHeader({ icon, title, description, children }: PageHeaderProps) {
  return (
    <section className="card mb-3">
      <div className="card-body d-flex flex-row justify-content-between align-items-center">
        <div>
          <div className="d-flex gap-2 align-items-center">
            {icon && <i className={`bi ${icon} fs-2`}></i>}
            <h1 className="mb-0">{title}</h1>
          </div>
          {description && <p className="text-muted mb-0 mt-1">{description}</p>}
        </div>
        {children && <div className="d-flex gap-2 align-items-center">{children}</div>}
      </div>
    </section>
  );
}
