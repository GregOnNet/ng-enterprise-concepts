export interface DataTableColumnHeader<TModel> {
  key: keyof TModel;
  label?: string;
}
