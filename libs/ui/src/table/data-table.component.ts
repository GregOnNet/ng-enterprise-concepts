import {
  Component,
  computed,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { NgComponentOutlet, NgForOf, NgIf } from '@angular/common';
import { DataTableColumnTitlePipe } from './data-table-column-title.pipe';
import {
  DataTableColumn,
  DataTableSource,
  PageChangedArguments,
  SortingChangedArguments,
} from './types';
import { createInitialDataTableSource } from './create-initial-data-table-source';

@Component({
  selector: 'ui-data-table',
  standalone: true,
  imports: [
    MatTableModule,
    NgForOf,
    DataTableColumnTitlePipe,
    NgIf,
    NgComponentOutlet,
  ],
  styles: ['.scroll { overflow: auto }'],
  template: `
    <div class="scroll">
      <table mat-table [dataSource]="dataSourceSignal().models">
        <ng-container
          [matColumnDef]="column.header.key"
          *ngFor="
            let column of columnsSignal();
            trackBy: dataSourceSignal().trackBy
          "
        >
          <th mat-header-cell *matHeaderCellDef>
            {{ column.header | dataTableColumnTitle }}
          </th>

          <td mat-cell *matCellDef="let model">
            <ng-container
              *ngIf="column.cellComponent; else plainText"
              [ngComponentOutlet]="column.cellComponent.type"
              [ngComponentOutletInputs]="column.cellComponent.inputs(model)"
            ></ng-container>

            <ng-template #plainText>{{ model[column.header.key] }}</ng-template>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns()"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns()"></tr>
      </table>
    </div>
  `,
})
export class DataTable<TModel> {
  @Input() set columns(value: DataTableColumn<TModel>[]) {
    this.columnsSignal.set(value);
  }

  @Input() set dataSource(value: DataTableSource<TModel>) {
    this.dataSourceSignal.set(value);
  }

  @Output() pageChanged = new EventEmitter<PageChangedArguments>();
  @Output() selectionChanged = new EventEmitter<TModel[]>();
  @Output() sortingChanged = new EventEmitter<
    SortingChangedArguments<TModel>
  >();

  protected columnsSignal = signal<DataTableColumn<TModel>[]>([]);
  protected dataSourceSignal = signal<DataTableSource<TModel>>(
    createInitialDataTableSource()
  );

  protected displayedColumns = computed(() => {
    return this.columnsSignal().map((column) => column.header.key);
  });
}
