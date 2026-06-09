import { ColumnDef, FilterFn } from '@tanstack/react-table';

export type { ColumnDef };

export interface SearchConfig<TData> {
  fields: (keyof TData)[];
  placeholder: string;
  filterFn: FilterFn<TData>;
}

export interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  isLoading?: boolean;
  onRowClick?: (row: TData) => void;
  emptyStateMessage?: string;
  searchPlaceholder?: string;
  showPagination?: boolean;
  pageSize?: number;
  searchKey?: string;
  showSearch?: boolean;
  searchConfig?: SearchConfig<TData>;
}

export interface TablePagination {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface TableState<T, F = unknown> {
  pagination: TablePagination;
  sorting: { id: string; desc: boolean }[];
  filters: { id: string; value: F }[];
  globalFilter: string;
  data: T[];
  isLoading: boolean;
}

export type OnRowClick<T> = (row: T) => void;
