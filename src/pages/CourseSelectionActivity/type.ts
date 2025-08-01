import { Course } from '@/schemas/courseSchema';

export type SelectedCourseType = Course & {
  fromOtherGrade?: boolean;
  selectedBySearch?: boolean;
};
