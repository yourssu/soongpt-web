import { sumBy } from 'es-toolkit';

import { CourseType } from '@/schemas/courseSchema';

export const useCoursesTotalPoint = (courses: CourseType[]): number => {
  return sumBy(courses, ({ point }) => point);
};
