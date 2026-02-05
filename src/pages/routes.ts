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
  course_retake: lazy(() =>
    import('@/pages/CourseRetakeActivity').then((module) => ({
      default: module.CourseRetakeActivity,
    })),
  ),
  course_major_required: lazy(() =>
    import('@/pages/CourseMajorRequiredActivity').then((module) => ({
      default: module.CourseMajorRequiredActivity,
    })),
  ),
  course_major_elective: lazy(() =>
    import('@/pages/CourseMajorElectiveActivity').then((module) => ({
      default: module.CourseMajorElectiveActivity,
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
  waitlist: lazy(() =>
    import('@/pages/WaitlistActivity').then((module) => ({
      default: module.WaitlistActivity,
    })),
  ),
};
