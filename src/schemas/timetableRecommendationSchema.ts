import { z } from 'zod/v4';

import { CourseSchema } from '@/schemas/courseSchema';
import { TimetableSchema } from '@/schemas/timetableSchema';
import { CourseClassification } from '@/types/course';

export const RecommendationStatusSchema = z.enum(['SUCCESS', 'SINGLE_CONFLICT', 'FAILURE']);
export type RecommendationStatusType = z.infer<typeof RecommendationStatusSchema>;

export const RecommendationDtoSchema = z.object({
  description: z.string(),
  timetable: TimetableSchema,
});
export type RecommendationDtoType = z.infer<typeof RecommendationDtoSchema>;

export const DeletableCourseDtoSchema = z.object({
  course: CourseSchema,
  category: z.enum(CourseClassification),
});
export type DeletableCourseDtoType = z.infer<typeof DeletableCourseDtoSchema>;
