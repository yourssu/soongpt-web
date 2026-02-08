import { z } from 'zod/v4';

import { CourseSchema } from '@/schemas/courseSchema';
import { ResponseSchema } from '@/schemas/response';
import { TimetableSchema } from '@/schemas/timetableSchema';
import { CourseClassification } from '@/types/course';

export const RecommendationStatusSchema = z.enum(['SUCCESS', 'SINGLE_CONFLICT', 'FAILURE']);
export type RecommendationStatusType = z.infer<typeof RecommendationStatusSchema>;

export const RecommendationDtoSchema = z.object({
  description: z.string(),
  timetable: TimetableSchema,
});
export type RecommendationDtoType = z.infer<typeof RecommendationDtoSchema>;

export const FullTimetableRecommendationResponseSchema = z.object({
  primaryTimetable: TimetableSchema,
  alternativeSuggestions: z.array(RecommendationDtoSchema),
});
export type FullTimetableRecommendationResponseType = z.infer<
  typeof FullTimetableRecommendationResponseSchema
>;

export const DeletableCourseDtoSchema = z.object({
  course: CourseSchema,
  category: z.enum(CourseClassification),
});
export type DeletableCourseDtoType = z.infer<typeof DeletableCourseDtoSchema>;

export const FinalTimetableRecommendationSchema = z.object({
  status: RecommendationStatusSchema,
  successResponse: FullTimetableRecommendationResponseSchema.nullable().optional(),
  singleConflictCourses: z.array(DeletableCourseDtoSchema).nullable().optional(),
});
export type FinalTimetableRecommendationType = z.infer<typeof FinalTimetableRecommendationSchema>;

export const FinalTimetableRecommendationResponseSchema = ResponseSchema(
  FinalTimetableRecommendationSchema,
);
export type FinalTimetableRecommendationResponseType = z.infer<
  typeof FinalTimetableRecommendationResponseSchema
>;

export type FinalTimetableRecommendationResponseInputType = z.input<
  typeof FinalTimetableRecommendationResponseSchema
>;
