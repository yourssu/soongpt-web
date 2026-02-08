import { api } from '@/api/client';
import { GetCoursesSearchParams } from '@/api/courses/_shared/request';
import { courseResponseSchema } from '@/schemas/courseSchema';

export const getDoubleMajorCourses = async (searchParams: GetCoursesSearchParams) => {
  const response = await api.get('courses/major/double', { timeout: false, searchParams }).json();
  return courseResponseSchema.parse(response);
};
