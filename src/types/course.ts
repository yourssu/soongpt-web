export const CourseClassification = [
  'MAJOR_REQUIRED',
  'MAJOR_ELECTIVE',
  'MAJOR_PREREQUISITE',
  'GENERAL_REQUIRED',
  'GENERAL_ELECTIVE',
  'DOUBLE_MAJOR',
  'MINOR',
  'TEACHING_CERTIFICATE',
  'RETAKE',
  'CHAPEL',
  'OTHER',
] as const;
export type CourseClassification = (typeof CourseClassification)[number];

export const CourseSelectionStepType = [
  'COURSE_SELECTION_RESULT',
  'DOUBLE_MAJOR',
  'GENERAL_REQUIRED',
  'MAJOR_ELECTIVE',
  'MAJOR_PREREQUISITE',
  'MAJOR_REQUIRED',
  'MINOR',
  'RETAKE',
  'TEACHING_CERTIFICATE',
] as const;
export type CourseSelectionStepType = (typeof CourseSelectionStepType)[number];
