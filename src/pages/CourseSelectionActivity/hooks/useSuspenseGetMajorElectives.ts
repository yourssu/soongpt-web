import { useSuspenseQueries } from '@tanstack/react-query';

import api from '@/api/client';
import { StudentMachineContext } from '@/contexts/StudentMachineContext';
import { courseResponseSchema } from '@/schemas/courseSchema';
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
        queryFn: async () => {
          const response = await api
            .get(`courses/major/elective`, { searchParams, timeout: false })
            .json();
          return courseResponseSchema.parse(response);
        },
      };
    }),
    combine: (results) => results.map((result) => result.data.result).flat(),
  });

  return courses;
};
