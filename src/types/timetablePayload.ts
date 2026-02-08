import { z } from 'zod/v4';

import { StudentSchema, type StudentType } from '@/types/student';
import { TimetableSchema, type TimetableType } from '@/types/timetable';
import {
  RecommendationStatusSchema,
  type RecommendationStatusType,
} from '@/types/timetableRecommendation';

export const TimetablePayloadSchema = StudentSchema.extend({
  codes: z.array(z.number()),
  generalElectivePoint: z.number(),
  generalRequiredCodes: z.array(z.number()),
  majorElectiveCodes: z.array(z.number()),
  majorRequiredCodes: z.array(z.number()),
  preferredGeneralElectives: z.array(z.string()),
});

export type TimetablePayloadType = z.infer<typeof TimetablePayloadSchema>;

export const TimetablePartialSelectionPayloadSchema = TimetablePayloadSchema.extend({
  selectedChapelCode: z.number().optional(),
  selectedGeneralElectiveCodes: z.array(z.number()),
});

export type TimetablePartialSelectionPayloadType = z.infer<
  typeof TimetablePartialSelectionPayloadSchema
>;

export const FinalizeTimetablePayloadSchema = z.object({
  partialSelection: TimetablePartialSelectionPayloadSchema,
  timetable: TimetableSchema,
});

export type FinalizeTimetablePayloadType = z.infer<typeof FinalizeTimetablePayloadSchema>;

export const TimetableRecommendationOptionsSchema = z.object({
  mockStatus: RecommendationStatusSchema.optional(),
});

export type TimetableRecommendationOptions = z.infer<typeof TimetableRecommendationOptionsSchema>;

export type { RecommendationStatusType, StudentType, TimetableType };
