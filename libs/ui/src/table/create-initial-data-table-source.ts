import { DataTableSource } from './types';

export function createInitialDataTableSource<
  TModel
>(): DataTableSource<TModel> {
  return {
    state: 'initial',
    models: [],
    totalModelsCount: 0,
    trackBy: () => 0,
  };
}
