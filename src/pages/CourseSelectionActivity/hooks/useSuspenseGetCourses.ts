import { useSuspenseQuery } from '@tanstack/react-query';

import {
  getGeneralRequiredCourses,
  getMajorElectiveCourses,
  getMajorRequiredCourses,
} from '@/api/courses';
import { useAssertedStudentInfoContext } from '@/components/Providers/StudentInfoProvider/hook';
import { CourseSelectionStepType } from '@/types/course';

type FetchableCourseType = Exclude<CourseSelectionStepType, 'COURSE_SELECTION_RESULT'>;

export const useSuspenseGetCourses = (type: FetchableCourseType) => {
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
