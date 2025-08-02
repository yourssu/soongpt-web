import { api } from '@/api/client';
import { courseResponseSchema, paginatedCourseResponseSchema } from '@/schemas/courseSchema';
import { Grade } from '@/schemas/studentSchema';

type GetCoursesSearchParams = {
  department: string;
  grade: Grade;
  schoolId: number;
};

export const getMajorRequiredCourses = async (searchParams: GetCoursesSearchParams) => {
  const response = await api
    .get('courses/major/required', {
      timeout: false,
      searchParams,
    })
    .json();
  return courseResponseSchema.parse(response);
};

export const getGeneralRequiredCourses = async (searchParams: GetCoursesSearchParams) => {
  const response = await api
    .get('courses/general/required', {
      timeout: false,
      searchParams,
    })
    .json();
  return courseResponseSchema.parse(response);
};

export const getMajorElectiveCourses = async (searchParams: GetCoursesSearchParams) => {
  const response = await api
    .get('courses/major/elective', {
      timeout: false,
      searchParams,
    })
    .json();
  return courseResponseSchema.parse(response);
};

export const getSearchedCourses = async (searchKeyword: string) => {
  if (searchKeyword === '') {
    return [];
  }

  const response = await api
    .get(`courses/search`, {
      searchParams: {
        q: searchKeyword,
      },
    })
    .json();

  return paginatedCourseResponseSchema.parse(response).result.content;
};
