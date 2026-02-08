import { useSuspenseQuery } from '@tanstack/react-query';

import { getDoubleMajorCourses } from '@/api/courses/get-double-major-courses';
import { getGeneralRequiredCourses } from '@/api/courses/get-general-required-courses';
import { getMajorElectiveCourses } from '@/api/courses/get-major-elective-courses';
import { getMajorPrerequisiteCourses } from '@/api/courses/get-major-prerequisite-courses';
import { getMajorRequiredCourses } from '@/api/courses/get-major-required-courses';
import { getMinorCourses } from '@/api/courses/get-minor-courses';
import { getRetakeCourses } from '@/api/courses/get-retake-courses';
import { getTeachingCertificateCourses } from '@/api/courses/get-teaching-certificate-courses';
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
        case 'DOUBLE_MAJOR':
          return getDoubleMajorCourses(searchParams);
        case 'GENERAL_REQUIRED':
          return getGeneralRequiredCourses(searchParams);
        case 'MAJOR_ELECTIVE':
          return getMajorElectiveCourses(searchParams);
        case 'MAJOR_PREREQUISITE':
          return getMajorPrerequisiteCourses(searchParams);
        case 'MAJOR_REQUIRED':
          return getMajorRequiredCourses(searchParams);
        case 'MINOR':
          return getMinorCourses(searchParams);
        case 'RETAKE':
          return getRetakeCourses(searchParams);
        case 'TEACHING_CERTIFICATE':
          return getTeachingCertificateCourses(searchParams);
      }
    },
    staleTime: Infinity,
  });

  return data.result;
};
