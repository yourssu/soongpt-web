import { basicUIPlugin } from '@stackflow/plugin-basic-ui';
import { basicRendererPlugin } from '@stackflow/plugin-renderer-basic';
import { stackflow } from '@stackflow/react';
import CourseSelectionActivity from './pages/CourseSelectionActivity';
import DesiredCreditActivity from './pages/DesiredCreditActivity';
import OnboardingActivity from './pages/OnboardingActivity';

export const { Stack, useFlow } = stackflow({
  transitionDuration: 350,
  plugins: [
    basicRendererPlugin(),
    basicUIPlugin({
      theme: 'cupertino',
    }),
  ],
  activities: {
    OnboardingActivity,
    CourseSelectionActivity,
    DesiredCreditActivity,
  },
  initialActivity: () => 'OnboardingActivity',
});
