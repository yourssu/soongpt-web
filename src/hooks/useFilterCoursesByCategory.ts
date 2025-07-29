import { Course } from '@/schemas/courseSchema';
import { CourseClassification } from '@/types/course';
import { Merge } from '@/utils/type';

type CourseWithCategory<T extends CourseClassification> = Merge<Course, { category: T }>;

type FilteredCoursesMapType = {
  [key in CourseClassification]: CourseWithCategory<key>[];
};

export const useFilterCoursesByCategory = (courses: Course[]) => {
  return Object.fromEntries(
    CourseClassification.map((category) => [
      category,
      courses.filter((course) => course.category === category),
    ]),
  ) as FilteredCoursesMapType;
};
