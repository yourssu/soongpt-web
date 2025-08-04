import { basicUIPlugin } from '@stackflow/plugin-basic-ui';
import { historySyncPlugin } from '@stackflow/plugin-history-sync';
import { basicRendererPlugin } from '@stackflow/plugin-renderer-basic';
import { stackflow } from '@stackflow/react';
import { lazy } from '@stackflow/react/future';

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
    OnboardingActivity: lazy(() =>
      import('@/pages/OnboardingActivity').then((module) => ({
        default: module.OnboardingActivity,
      })),
    ),
    CourseSelectionActivity: lazy(() =>
      import('@/pages/CourseSelectionActivity').then((module) => ({
        default: module.CourseSelectionActivity,
      })),
    ),
    DesiredCreditActivity: lazy(() =>
      import('@/pages/DesiredCreditActivity').then((module) => ({
        default: module.DesiredCreditActivity,
      })),
    ),
    TimetableSelectionActivity: lazy(() =>
      import('@/pages/TimetableSelectionActivity').then((module) => ({
        default: module.TimetableSelectionActivity,
      })),
    ),
    CourseSearchActivity: lazy(() =>
      import('@/pages/CourseSearchActivity').then((module) => ({
        default: module.CourseSearchActivity,
      })),
    ),
  },
});

export type ActivityNames = keyof typeof activities;
