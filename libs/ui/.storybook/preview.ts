// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/angular';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

const preview: Preview = {
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS, // newViewports would be an ViewportMap. (see below for examples)
      defaultViewport: 'desktop',
    },
  },
};

export default preview;
