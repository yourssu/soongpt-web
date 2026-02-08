import { api } from '@/api/client';
import { paginatedCourseResponseSchema } from '@/schemas/courseSchema';

export const getSearchedCourses = async (searchKeyword: string) => {
  if (searchKeyword === '') {
    return [];
  }

  const response = await api.get('courses/search', { searchParams: { q: searchKeyword } }).json();
  return paginatedCourseResponseSchema.parse(response).result.content;
};
