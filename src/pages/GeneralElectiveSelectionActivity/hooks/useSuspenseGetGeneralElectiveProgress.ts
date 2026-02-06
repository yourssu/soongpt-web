import { useSuspenseQuery } from '@tanstack/react-query';

import { getGeneralElectiveCreditProgress } from '@/api/creditProgress';
import { useAssertedStudentInfoContext } from '@/components/Providers/StudentInfoProvider/hook';

export const useSuspenseGetGeneralElectiveProgress = () => {
  const { schoolId, grade, department } = useAssertedStudentInfoContext();

  const searchParams = {
    schoolId,
    grade,
    department,
  };

  const { data } = useSuspenseQuery({
    queryKey: ['general-elective-progress', searchParams],
    queryFn: () => getGeneralElectiveCreditProgress(searchParams),
    staleTime: Infinity,
  });

  return data;
};
