import { z } from 'zod';
import { courseTimeSchema } from './courseSchema';

const timetableTagSchema = z.enum([
  'DEFAULT',
  'HAS_FREE_DAY',
  'NO_MORNING_CLASSES',
  'NO_LONG_BREAKS',
  'EVENLY_DISTRIBUTED',
  'GUARANTEED_LUNCH_TIME',
  'NO_EVENING_CLASSES',
]);

const timetableCourseSchema = z.object({
  courseName: z.string(),
  professorName: z.string(),
  classification: z.string(),
  credit: z.number(),
  courseTime: z.array(courseTimeSchema),
});

const timetableSchema = z.object({
  timetableId: z.number(),
  tag: timetableTagSchema,
  score: z.number(),
  courses: z.array(timetableCourseSchema),
});

export const timetableResponseSchema = z.object({
  timestamp: z.string(),
  result: timetableSchema,
});

export const timetableArrayResponseSchema = z.object({
  timestamp: z.string(),
  result: z.object({
    timetables: z.array(timetableSchema),
  }),
});

export type Timetable = z.infer<typeof timetableSchema>;
export type TimetableTag = z.infer<typeof timetableTagSchema>;
export type TimetableArrayResponse = z.infer<typeof timetableArrayResponseSchema>;
