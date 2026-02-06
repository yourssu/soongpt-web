import { z } from 'zod/v4';

import { ResponseSchema } from '@/schemas/response';
import { TimetableSchema } from '@/schemas/timetableSchema';

const TimetableSuggestRemoveActionSchema = z.object({
  type: z.literal('REMOVE'),
  courseCode: z.number(),
  courseName: z.string(),
  label: z.string(),
});

const TimetableSuggestReplaceActionSchema = z.object({
  type: z.literal('REPLACE'),
  fromCourseCode: z.number(),
  fromCourseName: z.string(),
  toCourseCode: z.number(),
  toCourseName: z.string(),
  label: z.string(),
});

export const TimetableSuggestActionSchema = z.discriminatedUnion('type', [
  TimetableSuggestRemoveActionSchema,
  TimetableSuggestReplaceActionSchema,
]);
export type TimetableSuggestActionType = z.infer<typeof TimetableSuggestActionSchema>;

export const TimetableSuggestItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  actions: z.array(TimetableSuggestActionSchema),
  selectionMode: z.enum(['single', 'multiple']).default('single'),
});
export type TimetableSuggestItemType = z.infer<typeof TimetableSuggestItemSchema>;

export const TimetableSuggestSchema = z.object({
  timetable: TimetableSchema,
  notices: z.array(TimetableSuggestItemSchema),
  suggestions: z.array(TimetableSuggestItemSchema),
});
export type TimetableSuggestType = z.infer<typeof TimetableSuggestSchema>;

export const TimetableSuggestResponseSchema = ResponseSchema(TimetableSuggestSchema);
export type TimetableSuggestResponseType = z.infer<typeof TimetableSuggestResponseSchema>;
export type TimetableSuggestResponseInputType = z.input<typeof TimetableSuggestResponseSchema>;
