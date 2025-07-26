import { Course } from '@/schemas/courseSchema';

export type CourseSelectionChangeActionType = '삭제' | '추가';

export type CourseSelectionChangeActionPayload = {
  course: Course;
  type: CourseSelectionChangeActionType;
};
