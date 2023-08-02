import { Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { NgComponentOutlet, NgForOf, NgIf } from '@angular/common';
import { DataTableColumnTitlePipe } from './data-table-column-title.pipe';
import {
  DataTableColumn,
  DataTableSource,
  PageChangedArguments,
  SelectionMode,
  SortingChangedArguments,
} from './types';
import { createEmpty } from './create-empty';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';

export interface IndeterminateCheckboxState {
  checked: boolean;
  indeterminate: boolean;
}

@Component({
  selector: 'ui-data-table',
  standalone: true,
  imports: [
    MatTableModule,
    NgForOf,
    DataTableColumnTitlePipe,
    NgIf,
    NgComponentOutlet,
    MatCheckboxModule,
  ],
  styles: ['.scroll { overflow: auto }'],
  template: `
      <div class="scroll">
          <table mat-table [dataSource]="dataSourceSignal().models">
              <!-- Selection -->
              <ng-container *ngIf="selectionModeSignal() !== 'none'" [matColumnDef]="selectionColumnKey" sticky>
                  <th mat-header-cell *matHeaderCellDef>
                      <mat-checkbox
                              *ngIf="selectionModeSignal() === 'multiple'"
                              (change)="toggleSelectAll()"
                              [checked]="selectionIndeterminateCheckboxSignal().checked"
                              [indeterminate]="selectionIndeterminateCheckboxSignal().indeterminate"
                      />
                  </th>
                  <td mat-cell *matCellDef="let model">
                      <mat-checkbox
                              [disabled]="dataSourceSignal().disableSelection(model)"
                              (click)="toggleSelection(model)"
                              [checked]="selectionModel?.isSelected(model)"
                      />
                  </td>
              </ng-container>
              <!-- /Selection -->

              <ng-container
                      [matColumnDef]="column.header.key"
                      *ngFor="let column of columnsSignal(); trackBy: dataSourceSignal().trackBy"
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
    if (!value.disableSelection) value.disableSelection = () => false;

    this.dataSourceSignal.set(value);
  }

  @Input() set selectionMode(value: SelectionMode) {
    if (value === this.selectionModeSignal()) return;

    this.selectionModeSignal.set(value);

    if (value === 'none') {
      this.selectionModel = null;
    } else {
      this.selectionModel = new SelectionModel(value === 'multiple');
    }
  }

  @Output() pageChanged = new EventEmitter<PageChangedArguments>();
  @Output() selectionChanged = new EventEmitter<TModel[]>();
  @Output() sortingChanged = new EventEmitter<SortingChangedArguments<TModel>>();

  protected readonly columnsSignal = signal<DataTableColumn<TModel>[]>([]);
  protected readonly dataSourceSignal = signal<DataTableSource<TModel>>(createEmpty());

  protected selectionModel: SelectionModel<TModel> | null = null;
  protected readonly selectionColumnKey = '__selection__';
  protected readonly selectionModeSignal = signal<SelectionMode>('none');
  protected readonly selectionIndeterminateCheckboxSignal = signal<IndeterminateCheckboxState>({
    indeterminate: false,
    checked: false,
  });

  protected readonly modelColumns = computed(() => {
    return this.columnsSignal().map((column) => column.header.key.toString());
  });

  protected readonly displayedColumns = computed(() => {
    const columns = this.modelColumns();

    if (this.selectionModeSignal() !== 'none') {
      columns.unshift(this.selectionColumnKey);
    }

    return columns;
  });

  protected toggleSelectAll() {
    if (!this.selectionModel) throw new Error('Expected SelectionModel to be initialized');

    const models = this.dataSourceSignal().models;

    if (this.selectionModel.selected.length === models.length) {
      this.selectionModel.clear();
    } else {
      models.forEach((model) => this.selectionModel?.select(model));
    }

    this.setIndeterminateCheckbox();
  }

  protected toggleSelection(model: TModel) {
    if (!this.selectionModel) throw new Error('Expected SelectionModel to be initialized');

    this.selectionModel.isSelected(model)
      ? this.selectionModel.deselect(model)
      : this.selectionModel.select(model);

    this.setIndeterminateCheckbox();
  }

  private setIndeterminateCheckbox() {
    if (!this.selectionModel) throw new Error('Expected SelectionModel to be initialized');

    if (this.selectionModel.selected.length === 0) {
      this.selectionIndeterminateCheckboxSignal.set({ checked: false, indeterminate: false });
    } else if (this.dataSourceSignal().models.length === this.selectionModel.selected.length) {
      this.selectionIndeterminateCheckboxSignal.set({ checked: true, indeterminate: false });
    } else {
      this.selectionIndeterminateCheckboxSignal.set({ checked: false, indeterminate: true });
    }
  }
}
