import { lazy } from '@stackflow/react/future';

import { ActivityName } from '@/stackflow/metadata';
import { ActivityComponentType } from '@/utils/stackflow';

export const routes: Record<ActivityName, ActivityComponentType<any>> = {
  onboarding: lazy(() =>
    import('@/pages/OnboardingActivity').then((module) => ({
      default: module.OnboardingActivity,
    })),
  ),
  course_selection: lazy(() =>
    import('@/pages/CourseSelectionActivity').then((module) => ({
      default: module.CourseSelectionActivity,
    })),
  ),
  desired_credit: lazy(() =>
    import('@/pages/DesiredCreditActivity').then((module) => ({
      default: module.DesiredCreditActivity,
    })),
  ),
  timetable_selection: lazy(() =>
    import('@/pages/TimetableSelectionActivity').then((module) => ({
      default: module.TimetableSelectionActivity,
    })),
  ),
  course_search: lazy(() =>
    import('@/pages/CourseSearchActivity').then((module) => ({
      default: module.CourseSearchActivity,
    })),
  ),
};
