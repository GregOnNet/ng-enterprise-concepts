import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PaginatedDataTable } from './paginated-data.table';
import { first, interval, map, Observable, tap } from 'rxjs';
import { Component, DestroyRef, inject, Injectable, OnInit, signal } from '@angular/core';
import { UseQuery } from '@ngneat/query';
import { DataTableColumn, DataTableSource } from '../table/types';
import { PageChangedArguments } from './types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { orderBy as _orderBy } from 'lodash';

interface Invoice {
  id: string;
  number: string;
  payingDate: string;
  recipient: string;
  createdAt: string;
  createdBy: string;
  reviewedBy: string;
}

function mockInvoice(index: number): Invoice {
  return {
    id: crypto.randomUUID(),
    number: `#2023-08-02-${index + 1}`,
    payingDate: '2023-08-30',
    recipient: 'Alan Turing',
    createdAt: '2023-08-30 10:15',
    createdBy: 'finance@company.com',
    reviewedBy: 'finance-review@company.com',
  };
}

interface PagedData<TModel> {
  count: number;
  data: TModel[];
}

function readPagedInvoices(
  page: number,
  pageSize: number,
  orderBy?: {
    key: keyof Invoice;
    direction: 'asc' | 'desc' | '';
  }
): Observable<PagedData<Invoice>> {
  const offset = page * pageSize;
  const limit = pageSize;

  const invoicesTotal = 100;
  const invoiceDB = Array(invoicesTotal)
    .fill(null)
    .map((_, index) => mockInvoice(index));

  const pagedInvoices = {
    count: invoicesTotal,
    data: invoiceDB.slice(offset, offset + limit),
  };

  if (orderBy && orderBy.direction) {
    pagedInvoices.data = _orderBy(pagedInvoices.data, [orderBy.key], [orderBy.direction]);
    console.log(orderBy.direction, pagedInvoices.data);
  }

  return interval(500).pipe(
    first(),
    map(() => pagedInvoices)
  );
}

@Injectable({ providedIn: 'root' })
export class InvoiceClient {
  private readonly useQuery = inject(UseQuery);

  readPaged(
    page: number,
    pageSize: number,
    orderBy?: {
      key: keyof Invoice;
      direction: 'asc' | 'desc' | '';
    }
  ) {
    return this.useQuery({
      queryKey: ['invoices', page.toString()],
      queryFn: () => readPagedInvoices(page, pageSize, orderBy),
    });
  }
}

@Component({
  standalone: true,
  imports: [PaginatedDataTable, AsyncPipe],
  template: `
    <ui-paginated-data-table
      [columns]="columns"
      [dataSource]="dataSourceSignal()"
      (pageChanged)="readPage($event)"
    ></ui-paginated-data-table>
  `,
})
export class PaginatedTableSandboxComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly client = inject(InvoiceClient);

  protected readonly columns: DataTableColumn<Invoice>[] = [
    { header: { key: 'number' } },
    { header: { key: 'payingDate' } },
  ];

  protected dataSourceSignal = signal<DataTableSource<Invoice>>({
    state: 'loading',
    count: 0,
    trackBy: (_, model) => model.id,
    data: [],
  });

  async ngOnInit(): Promise<void> {
    this.loadFirstPage().subscribe();
  }

  readPage(args: PageChangedArguments<Invoice>) {
    this.client
      .readPaged(args.page, args.pageSize, args.orderBy)
      .result$.pipe(
        tap((result) => {
          this.dataSourceSignal.update((dataSource) => {
            return {
              ...dataSource,
              state: result.isLoading ? 'loading' : result.isFetched ? 'complete' : 'error',
              data: result.data?.data || [],
              count: result.data?.count || 0,
            };
          });
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private loadFirstPage() {
    return this.client.readPaged(0, 10).result$.pipe(
      tap((result) => {
        this.dataSourceSignal.update((dataSource) => {
          return {
            ...dataSource,
            state: result.isLoading ? 'loading' : result.isFetched ? 'complete' : 'error',
            data: result.data?.data || [],
            count: result.data?.count || 0,
          };
        });
      }),
      first((result) => result.isFetched)
    );
  }
}

const meta: Meta<PaginatedDataTable<Invoice>> = {
  component: PaginatedTableSandboxComponent,
  decorators: [applicationConfig({ providers: [provideAnimations()] })],
};

export default meta;

type Story = StoryObj<PaginatedDataTable<Invoice>>;

export const Simple: Story = {};
