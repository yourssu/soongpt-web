import { sumBy } from 'es-toolkit';

import { useFilterCoursesByCategory } from '@/hooks/useFilterCoursesByCategory';
import { CourseType } from '@/schemas/courseSchema';
import { CourseClassification } from '@/types/course';

export const useTotalPointsByCategory = (
  courses: CourseType[],
): Record<'total' | CourseClassification, number> => {
  const filteredCoursesByCategory = useFilterCoursesByCategory(courses);

  const reduceCoursePoints = (courses: CourseType[]) => {
    return sumBy(courses, ({ point }) => point);
  };

  return {
    OTHER: reduceCoursePoints(filteredCoursesByCategory.OTHER),
    CHAPEL: reduceCoursePoints(filteredCoursesByCategory.CHAPEL),
    GENERAL_REQUIRED: reduceCoursePoints(filteredCoursesByCategory.GENERAL_REQUIRED),
    GENERAL_ELECTIVE: reduceCoursePoints(filteredCoursesByCategory.GENERAL_ELECTIVE),
    MAJOR_REQUIRED: reduceCoursePoints(filteredCoursesByCategory.MAJOR_REQUIRED),
    MAJOR_ELECTIVE: reduceCoursePoints(filteredCoursesByCategory.MAJOR_ELECTIVE),
    total: reduceCoursePoints(courses),
  };
};
