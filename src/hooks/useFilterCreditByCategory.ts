import { useFilterCoursesByCategory } from '@/hooks/useFilterCoursesByCategory';
import { Course } from '@/schemas/courseSchema';
import { CourseClassification } from '@/types/course';

export const useTotalPointsByCategory = (
  courses: Course[],
): Record<'total' | CourseClassification, number> => {
  const filteredCoursesByCategory = useFilterCoursesByCategory(courses);

  const reduceCoursePoints = (courses: Course[]) => {
    return courses.reduce((acc, course) => acc + course.point, 0);
  };

  return {
    CHAPEL: reduceCoursePoints(filteredCoursesByCategory.CHAPEL),
    GENERAL_REQUIRED: reduceCoursePoints(filteredCoursesByCategory.GENERAL_REQUIRED),
    GENERAL_ELECTIVE: reduceCoursePoints(filteredCoursesByCategory.GENERAL_ELECTIVE),
    MAJOR_REQUIRED: reduceCoursePoints(filteredCoursesByCategory.MAJOR_REQUIRED),
    MAJOR_ELECTIVE: reduceCoursePoints(filteredCoursesByCategory.MAJOR_ELECTIVE),
    total: reduceCoursePoints(courses),
  };
};
