import { Course } from '@/schemas/courseSchema';

export type SelectedCourseType = Course & {
  selectedBySearch?: boolean;
};
