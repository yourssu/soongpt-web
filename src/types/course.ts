export const CourseClassification = [
  'MAJOR_REQUIRED',
  'MAJOR_ELECTIVE',
  'GENERAL_REQUIRED',
  'GENERAL_ELECTIVE',
  'CHAPEL',
  'OTHER',
] as const;
export type CourseClassification = (typeof CourseClassification)[number];

export const CourseSelectionStepType = [
  'COURSE_SELECTION_RESULT',
  'GENERAL_REQUIRED',
  'MAJOR_ELECTIVE',
  'MAJOR_REQUIRED',
] as const;
export type CourseSelectionStepType = (typeof CourseSelectionStepType)[number];
