import { z } from 'zod';

export const courseTimeSchema = z.object({
  week: z.string(),
  start: z.string(),
  end: z.string(),
  classroom: z.string(),
});

export const courseSchema = z.object({
  courseName: z.string(),
  professorName: z.string(),
  classification: z.string(),
  credit: z.number(),
  target: z.array(z.string()),
  courseTime: z.array(courseTimeSchema),
});

export const courseResponseSchema = z.object({
  timestamp: z.string().datetime(),
  result: z.array(courseSchema),
});
