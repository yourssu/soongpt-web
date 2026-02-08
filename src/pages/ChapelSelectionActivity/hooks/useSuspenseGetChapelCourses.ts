import { useSuspenseQuery } from '@tanstack/react-query';

import { getChapelCourses } from '@/api/courses/get-chapel-courses';
import { useAssertedStudentInfoContext } from '@/components/Providers/StudentInfoProvider/hook';

export const useSuspenseGetChapelCourses = () => {
  const { schoolId, grade, department } = useAssertedStudentInfoContext();

  const searchParams = {
    schoolId,
    grade,
    department,
  };

  const { data } = useSuspenseQuery({
    queryKey: ['CHAPEL', searchParams],
    queryFn: () => getChapelCourses(searchParams),
    staleTime: Infinity,
  });

  return data.result;
};
