import { z } from 'zod/v4';

import { CourseSchema, CourseTimeSchema } from '@/types/course';

export const timetableTagValues = [
  '기본 태그',
  '아침 수업이 없는 시간표',
  '공강 날이 있는 시간표',
  '우주 공강이 없는 시간표',
  '점심시간 보장되는 시간표',
  '저녁수업이 없는 시간표',
] as const;

export const timetableTags = z.literal(timetableTagValues);
export type TimetableTagType = z.infer<typeof timetableTags>;

export const TimetableCourseSchema = CourseSchema.extend({
  courseTimes: z.array(CourseTimeSchema),
});
export type TimetableCourseType = z.infer<typeof TimetableCourseSchema>;

export const TimetableSchema = z.object({
  timetableId: z.number(),
  tag: timetableTags,
  score: z.number().nullable(),
  totalPoint: z.number(),
  courses: z.array(TimetableCourseSchema),
});
export type TimetableType = z.infer<typeof TimetableSchema>;
export type TimetableInputType = z.input<typeof TimetableSchema>;
