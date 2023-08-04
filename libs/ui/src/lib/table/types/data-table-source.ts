import { LoadingState } from './index';
import { TrackByFunction } from '@angular/core';

export interface DataTableSource<TData> {
  data: TData[];

  /*
   * Represents the count of all models that could be retrieved.
   */
  count: number;

  /*
   * Tells rendering engine how to identify a
   * model for performance optimizations
   */
  trackBy: TrackByFunction<TData>;

  /*
   * Tells whether a row can be selected or not
   */
  disableSelection?: (model: TData) => boolean;

  /*
   * Represents the state of the models in the table.
   * e.g if they are loaded or not.
   */
  state: LoadingState;
}
