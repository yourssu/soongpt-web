import { api } from '@/api/client';
import { GetCoursesSearchParams } from '@/api/courses/_shared/request';
import { courseResponseSchema } from '@/api/courses/_shared/response';

export const getGeneralElectiveCourses = async (searchParams: GetCoursesSearchParams) => {
  const response = await api
    .get('courses/general/elective', { timeout: false, searchParams })
    .json();
  return courseResponseSchema.parse(response);
};
