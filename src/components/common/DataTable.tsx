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
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            {columns.map((col, i) => (
              <th key={i} scope="col">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isEmpty ? (
            <tr>
              <td colSpan={colSpan ?? columns.length} className="text-center py-4 text-muted">
                {emptyMessage}
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
