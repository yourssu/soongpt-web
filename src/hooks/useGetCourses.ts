import { useQueries } from '@tanstack/react-query';
import api from '../api/client';
import { courseResponseSchema } from '../schemas/courseSchema';
import { StudentWithoutChapel } from '../schemas/studentSchema';
import { CourseType } from '../type/course.type.ts';

const courseTypes = ['majorRequired', 'majorElective', 'generalRequired'] as const;

const url: Record<CourseType, string> = {
  majorRequired: 'major/required',
  majorElective: 'major/elective',
  generalRequired: 'general/required',
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
    majorRequired: results[0],
    majorElective: results[1],
    generalRequired: results[2],
  };
};
