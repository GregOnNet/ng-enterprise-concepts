import { Pipe, PipeTransform } from '@angular/core';

import { DataTableColumnHeader } from './types/data-table-column-header';

@Pipe({
  name: 'dataTableColumnTitle',
  standalone: true,
})
export class DataTableColumnTitlePipe<TModel> implements PipeTransform {
  transform(header: DataTableColumnHeader<TModel>): string {
    if (header.label) return header.label;

    return this.splitAndCapitalize(header.key.toString());
  }

  private splitAndCapitalize(candidate: string): string {
    const splitByCapitals = candidate.replace(/(?<!^)([A-Z])/g, ' $1');
    return splitByCapitals.charAt(0).toUpperCase() + splitByCapitals.slice(1);
  }
}
