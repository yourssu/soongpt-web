import { z } from 'zod/v4';

import { CourseSchema } from '@/schemas/courseSchema';
import { ResponseSchema } from '@/schemas/response';

export const TimetableAvailableCoursesSchema = z.object({
  generalElectives: z.array(CourseSchema),
  chapels: z.array(CourseSchema),
});
export type TimetableAvailableCoursesType = z.infer<typeof TimetableAvailableCoursesSchema>;

export const TimetableAvailableCoursesResponseSchema = ResponseSchema(
  TimetableAvailableCoursesSchema,
);
export type TimetableAvailableCoursesResponseType = z.infer<
  typeof TimetableAvailableCoursesResponseSchema
>;

export type TimetableAvailableCoursesResponseInputType = z.input<
  typeof TimetableAvailableCoursesResponseSchema
>;
