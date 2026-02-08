import { z } from 'zod/v4';

import { ResponseSchema } from '@/api/response';
import {
  DeletableCourseDtoSchema,
  RecommendationDtoSchema,
  RecommendationStatusSchema,
} from '@/schemas/timetableRecommendationSchema';
import { TimetableSchema } from '@/schemas/timetableSchema';

const FullTimetableRecommendationResponseSchema = z.object({
  primaryTimetable: TimetableSchema,
  alternativeSuggestions: z.array(RecommendationDtoSchema),
});

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
