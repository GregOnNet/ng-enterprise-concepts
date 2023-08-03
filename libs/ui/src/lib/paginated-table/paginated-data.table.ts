import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { DataTable } from '@pg/ui';
import { PageChangedArguments } from './types';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { NgIf } from '@angular/common';
import { DataTableColumn, DataTableSource } from '../table/types';

@Component({
  selector: 'ui-paginated-table',
  standalone: true,
  imports: [DataTable, MatPaginatorModule, NgIf],
  template: `
    <ui-data-table
      *ngIf="dataSourceSignal() as dataSource"
      [columns]="columns"
      [dataSource]="dataSource"
    ></ui-data-table>

    <mat-paginator
      [length]="paginatorSignal().length"
      [pageSize]="paginatorSignal().pageSize"
      [pageSizeOptions]="paginatorSignal().pageSizeOptions"
      (page)="updatePaginator($event)"
    ></mat-paginator>
  `,
  styles: [],
})
export class PaginatedDataTable<TModel> {
  @Input({ required: true }) columns: DataTableColumn<TModel>[] = [];

  @Input({ required: true }) set dataSource(value: DataTableSource<TModel>) {
    this.dataSourceSignal.set(value);

    this.paginatorSignal.mutate((paginator) => (paginator.length = value.totalModelsCount));
  }

  @Output() pageChanged = new EventEmitter<PageChangedArguments>();

  protected readonly dataSourceSignal = signal<DataTableSource<TModel> | null>(null);
  protected readonly paginatorSignal = signal({
    currentPage: 0,
    length: 0,
    pageSize: 10,
    pageSizeOptions: [10, 20, 50],
  });

  protected updatePaginator($event: PageEvent) {
    const currentPage = $event.pageIndex + 1;
    const pageSize = $event.pageSize + 1;

    this.paginatorSignal.mutate((paginator) => {
      paginator.currentPage = currentPage;
      paginator.pageSize = pageSize;
    });

    this.pageChanged.emit({ currentPage, pageSize });
  }
}
