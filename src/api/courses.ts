import { api } from '@/api/client';
import { courseResponseSchema, paginatedCourseResponseSchema } from '@/schemas/courseSchema';
import { StudentGrade } from '@/types/student';

type GetCoursesSearchParams = {
  department: string;
  grade: StudentGrade;
  schoolId: number;
};

export const getMajorRequiredCourses = async (searchParams: GetCoursesSearchParams) => {
  const response = await api.get('courses/major/required', { timeout: false, searchParams }).json();
  return courseResponseSchema.parse(response);
};

export const getGeneralRequiredCourses = async (searchParams: GetCoursesSearchParams) => {
  const response = await api
    .get('courses/general/required', { timeout: false, searchParams })
    .json();
  return courseResponseSchema.parse(response);
};

export const getGeneralElectiveCourses = async (searchParams: GetCoursesSearchParams) => {
  const response = await api
    .get('courses/general/elective', { timeout: false, searchParams })
    .json();
  return courseResponseSchema.parse(response);
};

export const getChapelCourses = async (searchParams: GetCoursesSearchParams) => {
  const response = await api.get('courses/chapel', { timeout: false, searchParams }).json();
  return courseResponseSchema.parse(response);
};

export const getMajorElectiveCourses = async (searchParams: GetCoursesSearchParams) => {
  const response = await api.get('courses/major/elective', { timeout: false, searchParams }).json();
  return courseResponseSchema.parse(response);
};

export const getRetakeCourses = async (searchParams: GetCoursesSearchParams) => {
  const response = await api.get('courses/retake', { timeout: false, searchParams }).json();
  return courseResponseSchema.parse(response);
};

export const getMajorPrerequisiteCourses = async (searchParams: GetCoursesSearchParams) => {
  const response = await api
    .get('courses/major/prerequisite', { timeout: false, searchParams })
    .json();
  return courseResponseSchema.parse(response);
};

export const getDoubleMajorCourses = async (searchParams: GetCoursesSearchParams) => {
  const response = await api.get('courses/major/double', { timeout: false, searchParams }).json();
  return courseResponseSchema.parse(response);
};

export const getMinorCourses = async (searchParams: GetCoursesSearchParams) => {
  const response = await api.get('courses/minor', { timeout: false, searchParams }).json();
  return courseResponseSchema.parse(response);
};

export const getTeachingCertificateCourses = async (searchParams: GetCoursesSearchParams) => {
  const response = await api
    .get('courses/teaching-certificate', { timeout: false, searchParams })
    .json();
  return courseResponseSchema.parse(response);
};

export const getOtherMajorElectiveCourses = async (searchParams: GetCoursesSearchParams) => {
  const response = await api
    .get('courses/major/elective/other', { timeout: false, searchParams })
    .json();
  return courseResponseSchema.parse(response);
};

export const getSearchedCourses = async (searchKeyword: string) => {
  if (searchKeyword === '') {
    return [];
  }

  const response = await api.get('courses/search', { searchParams: { q: searchKeyword } }).json();
  return paginatedCourseResponseSchema.parse(response).result.content;
};
