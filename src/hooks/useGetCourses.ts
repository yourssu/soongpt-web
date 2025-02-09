import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import { courseResponseSchema } from '../schemas/courseSchema';
import { StudentWithoutChapel } from '../schemas/studentSchema';
import { CourseType } from '../type/course.type.ts';

interface UseGetCoursesParams {
  type: CourseType;
  info: StudentWithoutChapel;
}

const url: { [K in CourseType]: string } = {
  majorRequired: 'major/required',
  majorElective: 'major/elective',
  generalRequired: 'general/required',
};

export const useGetCourses = ({ type, info }: UseGetCoursesParams) => {
  return useQuery({
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
  });
};
