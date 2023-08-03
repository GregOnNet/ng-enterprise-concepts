// YourComponent.stories.ts

import type { Meta, StoryObj } from '@storybook/angular';
import { SkeletonComponent } from './skeleton.component';

const meta: Meta<SkeletonComponent> = {
  component: SkeletonComponent,
  args: {},
};

export default meta;

type Story = StoryObj<SkeletonComponent>;

export const Single: Story = {
  args: {
    lineCount: 1,
  },
};

export const Multiple: Story = {
  args: {
    lineCount: 10,
  },
};
