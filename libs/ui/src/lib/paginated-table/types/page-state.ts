export interface PageState<TData> {
  pageSizeOptions: number[];
  length: number;
  pageSize: number;
  currentPage: number;
  sorting?: { key: keyof TData; direction: 'asc' | 'desc' | '' };
}
