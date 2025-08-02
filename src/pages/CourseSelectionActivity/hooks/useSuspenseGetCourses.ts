import { useSuspenseQuery } from '@tanstack/react-query';

import {
  getGeneralRequiredCourses,
  getMajorElectiveCourses,
  getMajorRequiredCourses,
} from '@/api/courses';
import { StudentMachineContext } from '@/contexts/StudentMachineContext';
import { CourseType } from '@/types/course';

export const useSuspenseGetCourses = (type: CourseType) => {
  const state = StudentMachineContext.useSelector((state) => state);

  const searchParams = {
    schoolId: state.context.admissionYear,
    grade: state.context.grade,
    department: state.context.department,
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
