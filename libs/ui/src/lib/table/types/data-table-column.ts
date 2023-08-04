import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableCellComponent } from './data-table-cell-component';
import { DataTableColumnStickiness } from './data-table-column-stickiness';

export interface DataTableColumn<TModel> {
  header: DataTableColumnHeader<TModel>;
  cellComponent?: DataTableCellComponent<TModel>;
  stickiness?: DataTableColumnStickiness;
}
