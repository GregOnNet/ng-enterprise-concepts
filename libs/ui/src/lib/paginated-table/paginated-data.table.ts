import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { DataTable } from '../table/data.table';
import { PageChangedArguments, PageState } from './types';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { NgIf } from '@angular/common';
import { DataTableColumn, DataTableSource, SortingChangedArguments } from '../table/types';

@Component({
  selector: 'ui-paginated-data-table',
  standalone: true,
  imports: [DataTable, MatPaginatorModule, NgIf],
  template: `
    <ui-data-table
      *ngIf="dataSourceSignal() as dataSource"
      [columns]="columns"
      [dataSource]="dataSource"
      (selectionChanged)="selectionChanged.emit($event)"
      (sortingChanged)="updateSorting($event)"
    ></ui-data-table>

    <mat-paginator
      [length]="pageSignal().length"
      [pageSize]="pageSignal().pageSize"
      [pageSizeOptions]="pageSignal().pageSizeOptions"
      (page)="updatePaginator($event)"
    ></mat-paginator>
  `,
  styles: [],
})
export class PaginatedDataTable<TData> {
  @Input({ required: true }) columns: DataTableColumn<TData>[] = [];

  @Input({ required: true }) set dataSource(value: DataTableSource<TData>) {
    this.dataSourceSignal.set(value);

    this.pageSignal.mutate((paginator) => (paginator.length = value.count));
  }

  @Output() pageChanged = new EventEmitter<PageChangedArguments<TData>>();
  @Output() selectionChanged = new EventEmitter<TData[]>();
  @Output() sortingChanged = new EventEmitter<SortingChangedArguments<TData>>();

  protected readonly dataSourceSignal = signal<DataTableSource<TData> | null>(null);
  readonly pageSignal = signal<PageState<TData>>({
    currentPage: 0,
    length: 0,
    pageSize: 10,
    pageSizeOptions: [10, 20, 50],
  });

  protected updatePaginator($event: PageEvent) {
    const page = $event.pageIndex;
    const pageSize = $event.pageSize;

    this.pageSignal.mutate((paginator) => {
      paginator.currentPage = page;
      paginator.pageSize = pageSize;
    });

    this.pageChanged.emit({ page, pageSize });
  }

  protected updateSorting(sortingChangedArguments: SortingChangedArguments<TData>) {
    this.pageSignal.mutate((page) => {
      page.sorting = {
        key: sortingChangedArguments.key,
        direction: sortingChangedArguments.direction,
      };
    });

    const page = this.pageSignal();

    this.pageChanged.emit({
      page: page.currentPage,
      pageSize: page.pageSize,
      orderBy: page.sorting,
    });
  }
}
