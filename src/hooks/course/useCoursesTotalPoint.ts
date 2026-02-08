import { sumBy } from 'es-toolkit';

import { CourseType } from '@/types/course';

export const useCoursesTotalPoint = (courses: CourseType[]): number => {
  return sumBy(courses, ({ point }) => point);
};
