import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableCellComponent } from './data-table-cell-component';

export interface DataTableColumn<TModel> {
  header: DataTableColumnHeader<TModel>;
  cellComponent?: DataTableCellComponent<TModel>;
}
