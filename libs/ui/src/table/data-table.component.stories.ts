// YourComponent.stories.ts

import type { Meta, StoryObj } from '@storybook/angular';

import { DataTable } from './data-table.component';
import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { component } from './component';

interface Invoice {
  id: string;
  number: string;
  payingDate: string;
}

//👇 This default export determines where your story goes in the story list
const meta: Meta<DataTable<Invoice>> = {
  component: DataTable,
  args: {
    dataSource: {
      state: 'complete',
      totalModelsCount: 2,
      trackBy: (model) => model.id,
      models: [
        {
          id: crypto.randomUUID(),
          number: '#2023-08-02-1',
          payingDate: '2023-08-30',
        },
        {
          id: crypto.randomUUID(),
          number: '#2023-09-02-1',
          payingDate: '2023-09-31',
        },
      ],
    },
  },
};

export default meta;

type Story = StoryObj<DataTable<Invoice>>;

export const PlainValues: Story = {
  args: {
    //👇 The args you need here will depend on your component
    columns: [{ header: { key: 'number' } }, { header: { key: 'payingDate' } }],
  },
};

@Component({
  standalone: true,
  imports: [DatePipe],
  template: `{{ date | date }}`,
})
export class DateCellComponent {
  @Input() date?: string | number | Date;
}

export const CellComponents: Story = {
  args: {
    //👇 The args you need here will depend on your component
    columns: [
      { header: { key: 'number' } },
      {
        header: { key: 'payingDate' },
        cellComponent: component(DateCellComponent, (source: Invoice) => ({
          date: source.payingDate,
        })),
      },
    ],
  },
};
