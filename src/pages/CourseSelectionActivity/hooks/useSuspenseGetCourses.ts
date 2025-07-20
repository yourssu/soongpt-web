import { useSuspenseQuery } from '@tanstack/react-query';

import api from '@/api/client';
import { StudentMachineContext } from '@/contexts/StudentMachineContext';
import { courseResponseSchema } from '@/schemas/courseSchema';
import { CourseType } from '@/types/course';

const url: Record<CourseType, string> = {
  MAJOR_REQUIRED: 'major/required',
  MAJOR_ELECTIVE: 'major/elective',
  GENERAL_REQUIRED: 'general/required',
};

export const useSuspenseGetCourses = (type: CourseType) => {
  const state = StudentMachineContext.useSelector((state) => state);

  const searchParams = {
    schoolId: state.context.admissionYear,
    grade: state.context.grade,
    department: state.context.department,
  };

  const { data } = useSuspenseQuery({
    queryKey: [type, searchParams],
    queryFn: async () => {
      const response = await api
        .get(`courses/${url[type]}`, {
          searchParams,
          timeout: false,
        })
        .json();
      return courseResponseSchema.parse(response);
    },
    staleTime: Infinity,
  });

  return data.result;
};
