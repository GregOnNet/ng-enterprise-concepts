export interface SortingChangedArguments<TModel> {
  key: keyof TModel;
  direction: 'asc' | 'desc' | '';
}
