import { useSuspenseQuery } from '@tanstack/react-query';

import {
  getGeneralRequiredCourses,
  getMajorElectiveCourses,
  getMajorRequiredCourses,
} from '@/api/courses';
import { useAssertedStudentInfoContext } from '@/contexts/StudentInfoContext';
import { CourseType } from '@/types/course';

export const useSuspenseGetCourses = (type: CourseType) => {
  const { schoolId, grade, department } = useAssertedStudentInfoContext();

  const searchParams = {
    schoolId,
    grade,
    department,
  };

  const { data } = useSuspenseQuery({
    queryKey: [type, searchParams],
    queryFn: () => {
      switch (type) {
        case 'GENERAL_REQUIRED':
          return getGeneralRequiredCourses(searchParams);
        case 'MAJOR_ELECTIVE':
          return getMajorElectiveCourses(searchParams);
        case 'MAJOR_REQUIRED':
          return getMajorRequiredCourses(searchParams);
      }
    },
    staleTime: Infinity,
  });

  return data.result;
};
