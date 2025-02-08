import { z } from 'zod';
import { courseTimeSchema } from './courseSchema';

const timetableCourseSchema = z.object({
  courseName: z.string(),
  professorName: z.string(),
  classification: z.string(),
  credit: z.number(),
  courseTime: z.array(courseTimeSchema),
});

const timetableSchema = z.object({
  timetableId: z.number(),
  tag: z.string(),
  score: z.number(),
  courses: z.array(timetableCourseSchema),
});

export const timetableResponseSchema = z.object({
  timestamp: z.string().datetime(),
  result: timetableSchema,
});

export const timetableArrayResponseSchema = z.object({
  timestamp: z.string().datetime(),
  result: z.object({
    timetables: z.array(timetableSchema),
  }),
});

export type Timetable = z.infer<typeof timetableSchema>;
