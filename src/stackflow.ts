import { basicUIPlugin } from '@stackflow/plugin-basic-ui';
import { historySyncPlugin } from '@stackflow/plugin-history-sync';
import { basicRendererPlugin } from '@stackflow/plugin-renderer-basic';
import { stackflow } from '@stackflow/react';
import CourseSelectionActivity from './pages/CourseSelectionActivity';
import DesiredCreditActivity from './pages/DesiredCreditActivity';
import OnboardingActivity from './pages/OnboardingActivity';

export const { Stack, useFlow, useStepFlow } = stackflow({
  transitionDuration: 350,
  plugins: [
    basicRendererPlugin(),
    basicUIPlugin({
      theme: 'cupertino',
    }),
    historySyncPlugin({
      routes: {
        OnboardingActivity: '/',
        CourseSelectionActivity: '/course-selection',
        DesiredCreditActivity: '/desired-credit',
      },
      fallbackActivity: () => 'OnboardingActivity',
    }),
  ],
  activities: {
    OnboardingActivity,
    CourseSelectionActivity,
    DesiredCreditActivity,
  },
});
