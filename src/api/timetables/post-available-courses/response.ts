import { z } from 'zod/v4';

import { ResponseSchema } from '@/api/response';
import { CourseSchema } from '@/types/course';

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
