import { z } from 'zod/v4';

import { CourseClassification, CourseSchema } from '@/types/course';
import { TimetableSchema } from '@/types/timetable';

export const RecommendationStatusSchema = z.literal(['SUCCESS', 'SINGLE_CONFLICT', 'FAILURE']);
export type RecommendationStatusType = z.infer<typeof RecommendationStatusSchema>;

export const RecommendationDtoSchema = z.object({
  description: z.string(),
  timetable: TimetableSchema,
});
export type RecommendationDtoType = z.infer<typeof RecommendationDtoSchema>;

export const DeletableCourseDtoSchema = z.object({
  course: CourseSchema,
  category: CourseClassification,
});
export type DeletableCourseDtoType = z.infer<typeof DeletableCourseDtoSchema>;
