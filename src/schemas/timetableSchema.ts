import { z } from 'zod';

import { CourseSchema, CourseTimeSchema } from '@/schemas/courseSchema';
import { ResponseSchema } from '@/schemas/response';
import { timetableTags } from '@/types/timetable';

const TimetableCourseSchema = CourseSchema.extend({
  courseTimes: z.array(CourseTimeSchema),
});
export type TimetableCourseType = z.infer<typeof TimetableCourseSchema>;

const TimetableSchema = z.object({
  timetableId: z.number(),
  tag: z.enum(timetableTags),
  score: z.number().nullable(),
  totalPoint: z.number(),
  courses: z.array(TimetableCourseSchema),
});
export type TimetableType = z.infer<typeof TimetableSchema>;

export const TimetableResponseSchema = ResponseSchema(TimetableSchema);

export const TimetableArrayResponseSchema = ResponseSchema(
  z.object({
    timetables: z.array(TimetableSchema),
  }),
);
export type TimetableArrayResponseType = z.infer<typeof TimetableArrayResponseSchema>;
