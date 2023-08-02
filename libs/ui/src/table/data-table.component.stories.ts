// YourComponent.stories.ts

import type { Meta, StoryObj } from '@storybook/angular';

import { DataTable } from './data-table.component';

interface Invoice {
  id: string;
  number: string;
  payingDate: string;
}

//👇 This default export determines where your story goes in the story list
const meta: Meta<DataTable<Invoice>> = {
  component: DataTable,
};

export default meta;

type Story = StoryObj<DataTable<Invoice>>;

export const PlainValues: Story = {
  args: {
    //👇 The args you need here will depend on your component
    columns: [{ header: { key: 'number' } }, { header: { key: 'payingDate' } }],
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
