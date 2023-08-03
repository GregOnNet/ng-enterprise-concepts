export interface SortingChangedArguments<TModel> {
  key: keyof TModel;
  direction: 'ascending' | 'descending';
}
