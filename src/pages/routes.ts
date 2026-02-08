import { lazy } from '@stackflow/react/future';

import { ActivityName } from '@/stackflow/metadata';
import { ActivityComponentType } from '@/utils/stackflow';

export const routes: Record<ActivityName, ActivityComponentType<any>> = {
  onboarding: lazy(() =>
    import('@/pages/OnboardingActivity').then((module) => ({
      default: module.OnboardingActivity,
    })),
  ),
  landing: lazy(() =>
    import('@/pages/LandingActivity').then((module) => ({
      default: module.LandingActivity,
    })),
  ),
  loading: lazy(() =>
    import('@/pages/LoadingActivity').then((module) => ({
      default: module.LoadingActivity,
    })),
  ),
  course_selection: lazy(() =>
    import('@/pages/CourseSelectionActivity').then((module) => ({
      default: module.CourseSelectionActivity,
    })),
  ),
  general_elective_selection: lazy(() =>
    import('@/pages/GeneralElectiveSelectionActivity').then((module) => ({
      default: module.GeneralElectiveSelectionActivity,
    })),
  ),
  timetable_suggest: lazy(() =>
    import('@/pages/TimetableSuggestActivity').then((module) => ({
      default: module.TimetableSuggestActivity,
    })),
  ),
  timetable_delete: lazy(() =>
    import('@/pages/TimetableDeleteActivity').then((module) => ({
      default: module.TimetableDeleteActivity,
    })),
  ),
  timetable_guide: lazy(() =>
    import('@/pages/TimetableGuideActivity').then((module) => ({
      default: module.TimetableGuideActivity,
    })),
  ),
  timetable_result: lazy(() =>
    import('@/pages/TimetableResultActivity').then((module) => ({
      default: module.TimetableResultActivity,
    })),
  ),
  course_search: lazy(() =>
    import('@/pages/CourseSearchActivity').then((module) => ({
      default: module.CourseSearchActivity,
    })),
  ),
  chapel_selection: lazy(() =>
    import('@/pages/ChapelSelectionActivity').then((module) => ({
      default: module.ChapelSelectionActivity,
    })),
  ),
  waitlist: lazy(() =>
    import('@/pages/WaitlistActivity').then((module) => ({
      default: module.WaitlistActivity,
    })),
  ),
  error: lazy(() =>
    import('@/pages/ErrorActivity').then((module) => ({
      default: module.ErrorActivity,
    })),
  ),
  retry_login: lazy(() =>
    import('@/pages/RetryLoginActivity').then((module) => ({
      default: module.RetryLoginActivity,
    })),
  ),
};
