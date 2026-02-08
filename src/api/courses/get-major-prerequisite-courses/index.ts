import { api } from '@/api/client';
import { GetCoursesSearchParams } from '@/api/courses/_shared/request';
import { courseResponseSchema } from '@/schemas/courseSchema';

export const getMajorPrerequisiteCourses = async (searchParams: GetCoursesSearchParams) => {
  const response = await api
    .get('courses/major/prerequisite', { timeout: false, searchParams })
    .json();
  return courseResponseSchema.parse(response);
};
