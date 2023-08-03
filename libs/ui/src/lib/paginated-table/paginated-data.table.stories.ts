import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PaginatedDataTable } from './paginated-data.table';

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

const meta: Meta<PaginatedDataTable<Invoice>> = {
  component: PaginatedDataTable,
  decorators: [applicationConfig({ providers: [provideAnimations()] })],
  args: {
    dataSource: {
      state: 'complete',
      totalModelsCount: 20,
      trackBy: (_index, model) => model.id,
      models: Array(20)
        .fill(null)
        .map((_, i) => mockInvoice(i)),
    },
  },
};

export default meta;

type Story = StoryObj<PaginatedDataTable<Invoice>>;

export const Simple: Story = {
  args: {
    columns: [{ header: { key: 'number' } }, { header: { key: 'payingDate' } }],
  },
};
