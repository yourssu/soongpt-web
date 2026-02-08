import { CourseType } from '@/types/course';

export type SelectedCourseType = CourseType & {
  fromOtherGrade?: boolean;
  selectedBySearch?: boolean;
};
