import { CourseTimeType } from '@/schemas/courseSchema';
import { TimetableCourseType } from '@/schemas/timetableSchema';
import { TimetableTagType } from '@/types/timetable';
import { Merge } from '@/utils/type';

export const SLOT_HEIGHT = 56 / 12;
export const TIME_COL_WIDTH = 28;
export const GRID_MAX_WIDTH = 303;

export const timetableTagName = {
  '기본 태그': '🤔 뭔가 좋아보이는 시간표',
  '공강 날이 있는 시간표': '🥳 공강 날이 있는 시간표',
  '아침 수업이 없는 시간표': '⏰ 아침 수업이 없는 시간표',
  '우주 공강이 없는 시간표': '🚀 우주 공강이 없는 시간표 ',
  '점심시간 보장되는 시간표': '🍔 점심시간 보장되는 시간표',
  '저녁수업이 없는 시간표': '🛏 저녁수업이 없는 시간표',
} as const satisfies Record<TimetableTagType, string>;

export type InjectedTimetableCourseTime = CourseTimeType & { concat?: boolean };

export type InjectedTimetableCourse = Merge<
  TimetableCourseType,
  { courseTimes: InjectedTimetableCourseTime[] }
>;
