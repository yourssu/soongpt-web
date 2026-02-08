import { api } from '@/api/client';
import { paginatedCourseResponseSchema } from '@/api/courses/_shared/response';

export const getSearchedCourses = async (searchKeyword: string) => {
  if (searchKeyword === '') {
    return [];
  }

  const response = await api.get('courses/search', { searchParams: { q: searchKeyword } }).json();
  return paginatedCourseResponseSchema.parse(response).result.content;
};
