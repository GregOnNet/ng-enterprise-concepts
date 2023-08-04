import { DataTableSource } from './types';

export function createEmpty<TModel>(): DataTableSource<TModel> {
  return {
    state: 'initial',
    data: [],
    count: 0,
    trackBy: () => 0,
  };
}
