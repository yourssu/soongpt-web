import { useSuspenseQuery } from '@tanstack/react-query';

import { getOtherMajorElectiveCourses } from '@/api/courses';
import { useAssertedStudentInfoContext } from '@/components/Providers/StudentInfoProvider/hook';

export const useSuspenseGetOtherMajorElectives = () => {
  const { schoolId, grade, department } = useAssertedStudentInfoContext();

  const searchParams = {
    schoolId,
    grade,
    department,
  };

  const { data } = useSuspenseQuery({
    queryKey: ['OTHER_MAJOR_ELECTIVE', searchParams],
    queryFn: () => getOtherMajorElectiveCourses(searchParams),
    staleTime: Infinity,
  });

  return data.result;
};
