import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import { courseResponseSchema } from '../schemas/courseSchema';
import { StudentWithoutChapel } from '../schemas/studentSchema';

export const useGetMajorElective = ({ schoolId, department, grade }: StudentWithoutChapel) => {
  return useQuery({
    queryKey: ['majorElective', { schoolId, department, grade }],
    queryFn: async () => {
      const response = await api
        .get('courses/major/elective', {
          searchParams: { schoolId, department, grade },
        })
        .json();

      return courseResponseSchema.parse(response);
    },
  });
};
