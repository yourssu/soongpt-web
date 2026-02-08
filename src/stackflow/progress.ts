import { CourseSelectionStepType } from '@/types/course';

export const FLOW_PROGRESS = {
  onboarding: 0,
  timetable_suggest: 71,
  timetable_delete: 71,
  timetable_guide: 71,
  general_elective_selection: 86,
  chapel_selection: 93,
  timetable_result: 100,
} as const;

export const COURSE_SELECTION_PROGRESS = {
  RETAKE: 7,
  MAJOR_PREREQUISITE: 14,
  MAJOR_REQUIRED: 21,
  MAJOR_ELECTIVE: 29,
  DOUBLE_MAJOR: 36,
  MINOR: 43,
  TEACHING_CERTIFICATE: 50,
  GENERAL_REQUIRED: 57,
  COURSE_SELECTION_RESULT: 64,
} as const satisfies Record<CourseSelectionStepType, number>;
