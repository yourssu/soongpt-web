import { z } from 'zod/v4';

import { CourseSchema, CourseTimeSchema } from '@/schemas/courseSchema';
import { timetableTags } from '@/types/timetable';

const TimetableCourseSchema = CourseSchema.extend({
  courseTimes: z.array(CourseTimeSchema),
});
export type TimetableCourseType = z.infer<typeof TimetableCourseSchema>;

export const TimetableSchema = z.object({
  timetableId: z.number(),
  tag: z.enum(timetableTags),
  score: z.number().nullable(),
  totalPoint: z.number(),
  courses: z.array(TimetableCourseSchema),
});
export type TimetableType = z.infer<typeof TimetableSchema>;
export type TimetableInputType = z.input<typeof TimetableSchema>;
