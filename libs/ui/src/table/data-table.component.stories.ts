// YourComponent.stories.ts

import type { Meta, StoryObj } from '@storybook/angular';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

import { DataTable } from './data-table.component';
import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { component } from './component';

interface Invoice {
  id: string;
  number: string;
  payingDate: string;
  recipient: string;
  createdAt: string;
  createdBy: string;
  reviewedBy: string;
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
          recipient: 'Alan Turing',
          createdAt: '2023-08-30 10:15',
          createdBy: 'finance@company.com',
          reviewedBy: 'finance-review@company.com',
        },
        {
          id: crypto.randomUUID(),
          number: '#2023-09-02-1',
          payingDate: '2023-09-31',
          recipient: 'Konrad Zuse',
          createdAt: '2023-09-31 10:20',
          createdBy: 'finance@company.com',
          reviewedBy: 'finance-review@company.com',
        },
      ],
    },
  },
};

export default meta;

type Story = StoryObj<DataTable<Invoice>>;

export const PlainValues: Story = {
  args: {
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

export const Responsive: Story = {
  parameters: {
    viewport: { viewports: INITIAL_VIEWPORTS, defaultViewport: 'iphone6' },
  },
  args: {
    selectionMode: 'single',
    columns: [
      { header: { key: 'number' } },
      { header: { key: 'payingDate' } },
      { header: { key: 'recipient' } },
      { header: { key: 'createdAt' } },
      { header: { key: 'createdBy' } },
      { header: { key: 'reviewedBy' } },
    ],
  },
};

export const SingleSelection: Story = {
  args: {
    selectionMode: 'single',
    columns: [{ header: { key: 'number' } }, { header: { key: 'payingDate' } }],
  },
};

export const MultiSelection: Story = {
  args: {
    selectionMode: 'multiple',
    columns: [{ header: { key: 'number' } }, { header: { key: 'payingDate' } }],
  },
};
