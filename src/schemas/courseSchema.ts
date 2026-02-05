import { z } from 'zod/v4';

import { PaginatedSchema, ResponseSchema } from '@/schemas/response';
import { CourseClassification } from '@/types/course';

export const CourseTimeSchema = z.object({
  week: z.string(),
  start: z.string(),
  end: z.string(),
  classroom: z.string(),
});
export type CourseTimeType = z.infer<typeof CourseTimeSchema>;

export const CourseSchema = z.object({
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
  currentGrade: z.string().optional(),
});
export type CourseType = z.infer<typeof CourseSchema>;

export const courseResponseSchema = ResponseSchema(z.array(CourseSchema));
export const paginatedCourseResponseSchema = ResponseSchema(PaginatedSchema(CourseSchema));
