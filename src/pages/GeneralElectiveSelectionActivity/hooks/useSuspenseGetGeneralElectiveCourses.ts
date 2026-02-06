import { useSuspenseQuery } from '@tanstack/react-query';

import { getGeneralElectiveCourses } from '@/api/courses';
import { useAssertedStudentInfoContext } from '@/components/Providers/StudentInfoProvider/hook';

export const useSuspenseGetGeneralElectiveCourses = () => {
  const { schoolId, grade, department } = useAssertedStudentInfoContext();

  const searchParams = {
    schoolId,
    grade,
    department,
  };

  const { data } = useSuspenseQuery({
    queryKey: ['general-elective-courses', searchParams],
    queryFn: () => getGeneralElectiveCourses(searchParams),
    staleTime: Infinity,
  });

  return data.result;
};
