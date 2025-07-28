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
  category: z.enum(CourseClassification),
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
});

export const courseResponseSchema = z.object({
  timestamp: z.string(),
  result: z.array(courseSchema),
});

// Todo: 페이지네이션 스키마 공통화
export const paginatedCourseResponseSchema = z.object({
  timestamp: z.string(),
  result: z.object({
    content: z.array(courseSchema),
    totalElements: z.number(),
    totalPages: z.number(),
    size: z.number(),
    number: z.number(),
  }),
});

export type Course = z.infer<typeof courseSchema>;
export type CourseWithoutTarget = Omit<Course, 'target'>;
export type CourseTime = z.infer<typeof courseTimeSchema>;
