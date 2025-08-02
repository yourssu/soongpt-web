import { z } from 'zod';

import { CourseSchema, CourseTimeSchema } from '@/schemas/courseSchema';
import { ResponseSchema } from '@/schemas/response';

// Todo: 개선 필요
const TimetableTagSchema = z.enum([
  '기본 태그',
  '아침 수업이 없는 시간표',
  '공강 날이 있는 시간표',
  '우주 공강이 없는 시간표',
  '점심시간 보장되는 시간표',
  '저녁수업이 없는 시간표',
]);
export type TimetableTagType = z.infer<typeof TimetableTagSchema>;

const TimetableCourseSchema = CourseSchema.extend({
  courseTimes: z.array(CourseTimeSchema),
});
export type TimetableCourseType = z.infer<typeof TimetableCourseSchema>;

const TimetableSchema = z.object({
  timetableId: z.number(),
  tag: TimetableTagSchema,
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
