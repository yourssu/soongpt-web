import { CourseType } from '@/schemas/courseSchema';

export type SelectedCourseType = CourseType & {
  fromOtherGrade?: boolean;
  selectedBySearch?: boolean;
};
