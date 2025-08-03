import { CourseType } from '@/schemas/courseSchema';

export type CourseSelectionChangeActionType = '삭제' | '추가';

export type CourseSelectionChangeActionPayload = {
  course: CourseType;
  type: CourseSelectionChangeActionType;
};
