import {
  AfterViewInit,
  Component,
  computed,
  EventEmitter,
  Input,
  Output,
  signal,
  TrackByFunction,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgComponentOutlet, NgForOf, NgIf } from '@angular/common';
import { DataTableColumnTitlePipe } from './data-table-column-title.pipe';
import {
  DataTableColumn,
  DataTableSource,
  LoadingState,
  PageChangedArguments,
  SelectionMode,
  SortingChangedArguments,
} from './types';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SkeletonComponent } from '../skeleton/skeleton.component';

export interface IndeterminateCheckboxState {
  checked: boolean;
  indeterminate: boolean;
}

@Component({
  selector: 'ui-data-table',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NgComponentOutlet,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    DataTableColumnTitlePipe,
    SkeletonComponent,
  ],
  styles: [
    `
      .scroll {
        overflow: auto;
      }
    `,
  ],
  template: `
    <div class="scroll">
      <table mat-table [dataSource]="dataSourceSignal()" [trackBy]="trackBySignal()">
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
                [disabled]="disableSelectionSignal()(model)"
                (click)="toggleSelection(model)"
                [checked]="selectionModel?.isSelected(model)"
            />
          </td>
        </ng-container>
        <!-- /Selection -->

        <!-- Model Columns -->
        <ng-container
            [matColumnDef]="column.header.key"
            *ngFor="let column of columnsSignal();"
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

          <ng-container *ngIf="stateSignal() === 'loading'">
            <td class="skeleton__grid" mat-footer-cell *matFooterCellDef>
              <ui-skeleton [lineCount]="10"></ui-skeleton>
            </td>
          </ng-container>

        </ng-container>
        <!-- /Model Columns -->

        <tr mat-header-row *matHeaderRowDef="displayedColumns()"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns()"></tr>

        <ng-container *ngIf="stateSignal() === 'loading'">
            <tr mat-footer-row *matFooterRowDef="displayedColumns()"></tr>
        </ng-container>
      </table>
    </div>

    <mat-paginator [pageSizeOptions]="paginatorSignal().pageSizeOptions"
                   [pageSize]="paginatorSignal().pageSize"
                   [length]="paginatorSignal().length"
                   (page)="updatePagination($event)"
                   showFirstLastButtons
                   aria-label="Select page of periodic elements">
    </mat-paginator>
  `,
})
export class DataTable<TModel> implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit(): void {
    this.dataSourceSignal.mutate((dataSource) => (dataSource.paginator = this.paginator));
  }
  @Input() set columns(value: DataTableColumn<TModel>[]) {
    this.columnsSignal.set(value);
  }

  @Input() set dataSource(value: DataTableSource<TModel>) {
    this.dataSourceSignal.mutate((dataSource) => {
      dataSource.data = value.models;
    });

    this.stateSignal.set(value.state);
    this.trackBySignal.set(value.trackBy);
    this.paginatorSignal.mutate((paginator) => (paginator.length = value.totalModelsCount));

    if (value.disableSelection) this.disableSelectionSignal.set(value.disableSelection);
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

  protected readonly paginatorSignal = signal({
    pageSizeOptions: [10, 20, 50],
    pageSize: 10,
    length: 0,
    offset: 0,
    limit: 10,
  });

  protected readonly dataSourceSignal = signal<MatTableDataSource<TModel>>(
    new MatTableDataSource()
  );

  protected readonly stateSignal = signal<LoadingState>('loading');
  protected readonly trackBySignal = signal<TrackByFunction<TModel>>((index) => index);
  protected readonly disableSelectionSignal = signal<(model: TModel) => boolean>(() => false);

  protected readonly columnsSignal = signal<DataTableColumn<TModel>[]>([]);

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

    const models = this.dataSourceSignal().data;

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
    } else if (this.dataSourceSignal().data.length === this.selectionModel.selected.length) {
      this.selectionIndeterminateCheckboxSignal.set({ checked: true, indeterminate: false });
    } else {
      this.selectionIndeterminateCheckboxSignal.set({ checked: false, indeterminate: true });
    }
  }

  updatePagination($event: PageEvent) {
    const offset = $event.pageIndex * $event.pageSize;
    const limit = $event.pageSize;

    this.paginatorSignal.mutate((paginator) => {
      paginator.offset = offset;
      paginator.limit = limit;
    });

    this.pageChanged.emit({ offset, limit });
  }
}
