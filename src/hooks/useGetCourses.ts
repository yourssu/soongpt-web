import { useQueries } from '@tanstack/react-query';
import api from '../api/client';
import { courseResponseSchema } from '../schemas/courseSchema';
import { StudentWithoutChapel } from '../schemas/studentSchema';
import { CourseType } from '../type/course.type.ts';

const courseTypes = ['MAJOR_REQUIRED', 'MAJOR_ELECTIVE', 'GENERAL_REQUIRED'] as const;

const url: Record<CourseType, string> = {
  MAJOR_REQUIRED: 'major/required',
  MAJOR_ELECTIVE: 'major/elective',
  GENERAL_REQUIRED: 'general/required',
};

export const useGetCourses = (info: StudentWithoutChapel) => {
  const results = useQueries({
    queries: courseTypes.map((type) => ({
      queryKey: [type, info],
      queryFn: async () => {
        const response = await api
          .get(`courses/${url[type]}`, {
            searchParams: info,
          })
          .json();

        return courseResponseSchema.parse(response);
      },
      staleTime: Infinity,
    })),
  });

  return {
    MAJOR_REQUIRED: results[0],
    MAJOR_ELECTIVE: results[1],
    GENERAL_REQUIRED: results[2],
  };
};
