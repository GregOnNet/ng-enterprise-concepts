export interface PageChangedArguments<TData> {
  page: number;
  pageSize: number;
  orderBy?: { key: keyof TData; direction: 'asc' | 'desc' | '' };
}
