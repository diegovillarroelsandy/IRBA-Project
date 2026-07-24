import { ReactNode } from "react";

export interface DataTableColumn<T> {
  key: keyof T | string;

  header: string;

  width?: string;

  className?: string;

  render?: (row: T) => ReactNode;
}
export interface DataTableToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;

  buttonText?: string;
  onCreate?: () => void;
}

export interface DataTablePaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;

  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export interface DataTableEmptyStateProps {
  title?: string;
  description?: string;
}
