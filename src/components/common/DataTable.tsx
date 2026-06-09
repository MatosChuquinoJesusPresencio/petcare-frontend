import { Children, type ReactNode } from "react";

interface DataTableProps {
  columns: string[];
  children: ReactNode;
  emptyMessage?: string;
  colSpan?: number;
}

export default function DataTable({ columns, children, emptyMessage = "No hay registros.", colSpan }: DataTableProps) {
  const isEmpty = Children.count(children) === 0;

  return (
    <div className="tabla-contenedor">
      <table className="tabla-datos">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i} scope="col">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isEmpty ? (
            <tr>
              <td colSpan={colSpan ?? columns.length}>
                <div className="tabla-datos-vacio">
                  <div className="tabla-datos-vacio-icono">
                    <i className="bi bi-inbox"></i>
                  </div>
                  {emptyMessage}
                </div>
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
}
