import { z } from 'zod';

import { CourseClassification } from '@/types/course';

export const courseClassificationSchema = z.enum(CourseClassification);

export const courseTimeSchema = z.object({
  week: z.string(),
  start: z.string(),
  end: z.string(),
  classroom: z.string(),
});

export const courseSchema = z.object({
  courseName: z.string(),
  professorName: z.string(),
  classification: courseClassificationSchema,
  credit: z.number(),
  target: z.array(z.string()),
  courseTime: z.array(courseTimeSchema),
});

export const courseResponseSchema = z.object({
  timestamp: z.string(),
  result: z.array(courseSchema),
});

export type Course = z.infer<typeof courseSchema>;
export type CourseWithoutTarget = Omit<Course, 'target'>;
export type CourseTime = z.infer<typeof courseTimeSchema>;
