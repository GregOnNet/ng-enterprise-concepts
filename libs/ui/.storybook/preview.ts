// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/angular';
import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';

const preview: Preview = {
  parameters: {
    viewport: {
      viewports: MINIMAL_VIEWPORTS,
    },
  },
};

export default preview;
