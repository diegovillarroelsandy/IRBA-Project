"use client";

import {
  DataTableColumn,
  DataTableToolbarProps,
  DataTablePaginationProps,
  DataTableEmptyStateProps,
} from "./types";
import DataTableToolbar from "./DataTableToolbar";
import DataTablePagination from "./DataTablePagination";
import DataTableEmpty from "./DataTableEmpty";
import DataTableSkeleton from "./DataTableSkeleton";
import DataTableFilters from "./DataTableFilters";
interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];

  loading?: boolean;

  toolbar?: DataTableToolbarProps;

  pagination?: DataTablePaginationProps;

  emptyState?: DataTableEmptyStateProps;
  filters?: React.ReactNode;
}

export default function DataTable<T>({
  data,
  columns,
  loading = false,
  toolbar,
  pagination,
  emptyState,
  filters,
}: DataTableProps<T>) {
  return (
    <div className="rounded-md border bg-white overflow-hidden">
      <div className="overflow-x-auto">
        {toolbar && (
          <div className="p-4 border-b">
            <DataTableToolbar {...toolbar} />
          </div>
        )}
        {filters && <div className="p-4 border-b">{filters}</div>}
        <table className="w-full caption-bottom text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground ${
                    column.className ?? ""
                  }`}
                  style={{
                    width: column.width,
                  }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length}>
                  <DataTableSkeleton rows={6} columns={columns.length} />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <DataTableEmpty
                    title={emptyState?.title}
                    description={emptyState?.description}
                  />
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={`p-4 align-middle ${column.className ?? ""}`}
                    >
                      {column.render
                        ? column.render(row)
                        : String(row[column.key as keyof T] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
        {pagination && <DataTablePagination {...pagination} />}
      </div>
    </div>
  );
}
