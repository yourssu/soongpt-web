import { useSuspenseQueries } from '@tanstack/react-query';
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

const getArrayState = <T>(array: T[]): 'FILLED' | 'EMPTY' =>
  array.length > 0 ? 'FILLED' : 'EMPTY';

export const useGetCourses = (info: StudentWithoutChapel) => {
  return useSuspenseQueries({
    queries: courseTypes.map((type) => ({
      queryKey: [type, info],
      queryFn: async () => {
        const response = await api
          .get(`courses/${url[type]}`, {
            searchParams: info,
            timeout: false,
          })
          .json();

        return courseResponseSchema.parse(response);
      },
      staleTime: Infinity,
    })),
    combine: (results) => ({
      MAJOR_REQUIRED: {
        ...results[0],
        arrayState: getArrayState(results[0].data?.result ?? []),
      },
      MAJOR_ELECTIVE: {
        ...results[1],
        arrayState: getArrayState(results[1].data?.result ?? []),
      },
      GENERAL_REQUIRED: {
        ...results[2],
        arrayState: getArrayState(results[2].data?.result ?? []),
      },
    }),
  });
};
