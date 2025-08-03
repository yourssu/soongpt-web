import { basicUIPlugin } from '@stackflow/plugin-basic-ui';
import { historySyncPlugin } from '@stackflow/plugin-history-sync';
import { basicRendererPlugin } from '@stackflow/plugin-renderer-basic';
import { stackflow } from '@stackflow/react';

import { CourseSearchActivity } from '@/pages/CourseSearchActivity';
import CourseSelectionActivity from '@/pages/CourseSelectionActivity';
import DesiredCreditActivity from '@/pages/DesiredCreditActivity';
import OnboardingActivity from '@/pages/OnboardingActivity';
import { TimetableSelectionActivity } from '@/pages/TimetableSelectionActivity';

export const stackflowTransitionDuration = 350;

export const { Stack, useFlow, useStepFlow, activities } = stackflow({
  transitionDuration: stackflowTransitionDuration,
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
        CourseSearchActivity: '/course-search',
      },
      fallbackActivity: () => 'OnboardingActivity',
    }),
  ],
  activities: {
    OnboardingActivity,
    CourseSelectionActivity,
    DesiredCreditActivity,
    TimetableSelectionActivity,
    CourseSearchActivity,
  },
});

export type ActivityNames = keyof typeof activities;
