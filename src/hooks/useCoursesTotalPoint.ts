import { sumBy } from 'es-toolkit';
import { useMemo } from 'react';

import { CourseType } from '@/schemas/courseSchema';

export const useCoursesTotalPoint = (courses: CourseType[]): number => {
  return useMemo(() => sumBy(courses, ({ point }) => point), [courses]);
};
