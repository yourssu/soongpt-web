import { z } from 'zod/v4';

export const CourseClassificationValues = [
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

export const CourseClassification = z.literal(CourseClassificationValues);
export type CourseClassification = z.infer<typeof CourseClassification>;

export const CourseSelectionStepTypeValues = [
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

export const CourseSelectionStepType = z.literal(CourseSelectionStepTypeValues);
export type CourseSelectionStepType = z.infer<typeof CourseSelectionStepType>;

export const CourseTimeSchema = z.object({
  week: z.string(),
  start: z.string(),
  end: z.string(),
  classroom: z.string(),
});
export type CourseTimeType = z.infer<typeof CourseTimeSchema>;

export const CourseSchema = z.object({
  category: CourseClassification,
  subCategory: z.string().nullable(),
  field: z.string().nullable(),
  code: z.number(),
  name: z.string(),
  professor: z
    .string()
    .nullable()
    .transform((professor) => professor?.split('\n') ?? []), // <교수님>\n<교수님>...
  department: z.string(),
  division: z.string().nullable(),
  time: z.string().transform((time) => Number(time)),
  point: z.string().transform((point) => Number(point)),
  personeel: z.number(),
  scheduleRoom: z.string(),
  target: z.string(),
  currentGrade: z.string().optional(),
  recommendedGrade: z.number().optional(),
});
export type CourseType = z.infer<typeof CourseSchema>;
