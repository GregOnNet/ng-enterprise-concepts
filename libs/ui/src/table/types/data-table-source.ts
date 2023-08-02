import { LoadingState } from './index';
import { TrackByFunction } from '@angular/core';

export interface DataTableSource<TModel> {
  models: TModel[];

  /*
   * Represents the count of all models that could be retrieved.
   */
  totalModelsCount: number;

  /*
   * Tells rendering engine how to identify a
   * model for performance optimizations
   */
  trackBy: TrackByFunction<TModel>;

  /*
   * Tells whether a row can be selected or not
   */
  disableSelection?: (model: TModel) => boolean;

  /*
   * Represents the state of the models in the table.
   * e.g if they are loaded or not.
   */
  state: LoadingState;
}
