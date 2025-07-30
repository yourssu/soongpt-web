import { z } from 'zod';

import { courseSchema, courseTimeSchema } from '@/schemas/courseSchema';

const timetableTagSchema = z.enum([
  '기본 태그',
  '아침 수업이 없는 시간표',
  '공강 날이 있는 시간표',
  '우주 공강이 없는 시간표',
  '점심시간 보장되는 시간표',
  '저녁수업이 없는 시간표',
]);

const timetableCourseSchema = courseSchema.extend({
  courseTimes: z.array(courseTimeSchema),
});

const timetableSchema = z.object({
  timetableId: z.number(),
  tag: timetableTagSchema,
  score: z.number().nullable(),
  totalPoint: z.number(),
  courses: z.array(timetableCourseSchema),
});

export const timetableResponseSchema = z.object({
  timestamp: z.string(),
  result: timetableSchema,
});

export const timetableArrayResponseSchema = z.object({
  timestamp: z.string(),
  result: z.object({
    timetables: z.array(timetableSchema),
  }),
});

export type Timetable = z.infer<typeof timetableSchema>;
export type TimetableTag = z.infer<typeof timetableTagSchema>;
export type TimetableArrayResponse = z.infer<typeof timetableArrayResponseSchema>;
export type TimetableCourse = z.infer<typeof timetableCourseSchema>;
