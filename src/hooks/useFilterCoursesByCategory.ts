import { Course } from '@/schemas/courseSchema';
import { CourseClassification } from '@/types/course';
import { Merge } from '@/utils/type';

type CourseWithCategory<TCategory extends CourseClassification, TCourse extends Course> = Merge<
  TCourse,
  { category: TCategory }
>;

type FilteredCoursesMapType<TCourse extends Course> = {
  [key in CourseClassification]: CourseWithCategory<key, TCourse>[];
};

export const useFilterCoursesByCategory = <TCourse extends Course>(courses: TCourse[]) => {
  return Object.fromEntries(
    CourseClassification.map((category) => [
      category,
      courses.filter((course) => course.category === category),
    ]),
  ) as unknown as FilteredCoursesMapType<TCourse>;
};
