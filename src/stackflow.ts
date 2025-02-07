import { basicUIPlugin } from '@stackflow/plugin-basic-ui';
import { historySyncPlugin } from '@stackflow/plugin-history-sync';
import { basicRendererPlugin } from '@stackflow/plugin-renderer-basic';
import { stackflow } from '@stackflow/react';
import CourseSelectionActivity from './pages/CourseSelectionActivity';
import DesiredCreditActivity from './pages/DesiredCreditActivity';
import OnboardingActivity from './pages/OnboardingActivity';
import TimetableSelectionActivity from './pages/TimetableSelectionActivity';

export const { Stack, useFlow } = stackflow({
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
        TimetableSelectionActivity: '/time-table-selection',
      },
      fallbackActivity: () => 'OnboardingActivity',
    }),
  ],
  activities: {
    OnboardingActivity,
    CourseSelectionActivity,
    DesiredCreditActivity,
    TimetableSelectionActivity,
  },
});
