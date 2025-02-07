import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import { courseResponseSchema } from '../schemas/courseSchema';
import { StudentWithoutChapel } from '../schemas/studentSchema';

export const useGetMajorRequired = ({ schoolId, department, grade }: StudentWithoutChapel) => {
  return useQuery({
    queryKey: ['majorRequired', { schoolId, department, grade }],
    queryFn: async () => {
      const response = await api
        .get('courses/major/required', {
          searchParams: { schoolId, department, grade },
        })
        .json();

      return courseResponseSchema.parse(response);
    },
  });
};
