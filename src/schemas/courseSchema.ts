import { z } from 'zod';

import { CourseClassification } from '@/types/course';

export const courseClassificationSchema = z.enum(CourseClassification);

export const courseTimeSchema = z.object({
  week: z.string(),
  start: z.string(),
  end: z.string(),
  classroom: z.string(),
});

export const courseCategorySchema = z.enum(['전선', '전필', '교필', '교선', '채플', '기타']);

export const courseSchema = z.object({
  category: courseCategorySchema,
  subCategory: z.string().nullable(),
  field: z.string().nullable(),
  code: z.number(),
  name: z.string(),
  professor: z.string().transform((professor) => professor.split('\n')), // <교수님>\n<교수님>...
  department: z.string(),
  division: z.string(),
  time: z.string().transform((time) => Number(time)),
  point: z.string().transform((point) => Number(point)),
  personeel: z.number(),
  scheduleRoom: z.string(),
  target: z.string(),
});

export const courseResponseSchema = z.object({
  timestamp: z.string(),
  result: z.array(courseSchema),
});

export type Course = z.infer<typeof courseSchema>;
export type CourseWithoutTarget = Omit<Course, 'target'>;
export type CourseTime = z.infer<typeof courseTimeSchema>;
