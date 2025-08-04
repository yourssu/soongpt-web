import { basicUIPlugin } from '@stackflow/plugin-basic-ui';
import { historySyncPlugin } from '@stackflow/plugin-history-sync';
import { basicRendererPlugin } from '@stackflow/plugin-renderer-basic';
import { stackflow } from '@stackflow/react/future';

import { routes } from '@/pages/routes';
import { stackflowConfig } from '@/stackflow/stackflow.config';

export const { Stack } = stackflow({
  config: stackflowConfig,
  components: routes,
  plugins: [
    basicRendererPlugin(),
    basicUIPlugin({
      theme: 'cupertino',
    }),
    historySyncPlugin({
      config: stackflowConfig,
      fallbackActivity: () => 'onboarding',
    }),
  ],
});
