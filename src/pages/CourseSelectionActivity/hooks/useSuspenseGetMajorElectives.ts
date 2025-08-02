import { useSuspenseQueries } from '@tanstack/react-query';

import { getMajorElectiveCourses } from '@/api/courses';
import { StudentMachineContext } from '@/contexts/StudentMachineContext';
import { Grade } from '@/schemas/studentSchema';

export const useSuspenseGetMajorElectives = (grades: Grade[]) => {
  const state = StudentMachineContext.useSelector((state) => state);

  const getSearchParams = (grade: Grade) => ({
    schoolId: state.context.admissionYear,
    department: state.context.department,
    grade,
  });

  const courses = useSuspenseQueries({
    queries: grades.map((grade) => {
      const searchParams = getSearchParams(grade);
      return {
        queryKey: ['MAJOR_ELECTIVE', searchParams],
        queryFn: () => getMajorElectiveCourses(searchParams),
      };
    }),
    combine: (results) => results.map((result) => result.data.result).flat(),
  });

  return courses;
};
