import { basicUIPlugin } from '@stackflow/plugin-basic-ui';
import { historySyncPlugin } from '@stackflow/plugin-history-sync';
import { basicRendererPlugin } from '@stackflow/plugin-renderer-basic';
import { stackflow } from '@stackflow/react/future';

import { routes } from '@/pages/routes';
import { stackflowConfig } from '@/stackflow/config';
import { utmPreservePlugin } from '@/stackflow/plugins/utmPreservePlugin';

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

    /**
     * historySyncPlugin이 먼저 initialEvents를 생성해야 최초 접속 시 UTM을 주입할 수 있으므로
     * historySyncPlugizn 이후에 utmPreservePlugin을 등록해야 함
     */
    utmPreservePlugin(),
  ],
});
