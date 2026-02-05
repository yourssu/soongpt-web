import { api } from '@/api/client';
import {
  MOCK_DOUBLE_MAJOR,
  MOCK_GENERAL_REQUIRED,
  MOCK_MAJOR_ELECTIVE,
  MOCK_MAJOR_PREREQUISITE,
  MOCK_MAJOR_REQUIRED,
  MOCK_MINOR,
  MOCK_RETAKE,
  MOCK_TEACHING_CERTIFICATE,
} from '@/api/mockCourses';
import { courseResponseSchema, paginatedCourseResponseSchema } from '@/schemas/courseSchema';
import { StudentGrade } from '@/types/student';

export const USE_MOCK = true;

type GetCoursesSearchParams = {
  department: string;
  grade: StudentGrade;
  schoolId: number;
};

export const getMajorRequiredCourses = async (searchParams: GetCoursesSearchParams) => {
  if (USE_MOCK) {
    return courseResponseSchema.parse(MOCK_MAJOR_REQUIRED);
  }

  const response = await api.get('courses/major/required', { timeout: false, searchParams }).json();
  return courseResponseSchema.parse(response);
};

export const getGeneralRequiredCourses = async (searchParams: GetCoursesSearchParams) => {
  if (USE_MOCK) {
    return courseResponseSchema.parse(MOCK_GENERAL_REQUIRED);
  }

  const response = await api
    .get('courses/general/required', { timeout: false, searchParams })
    .json();
  return courseResponseSchema.parse(response);
};

export const getMajorElectiveCourses = async (searchParams: GetCoursesSearchParams) => {
  if (USE_MOCK) {
    return courseResponseSchema.parse(MOCK_MAJOR_ELECTIVE);
  }

  const response = await api.get('courses/major/elective', { timeout: false, searchParams }).json();
  return courseResponseSchema.parse(response);
};

export const getRetakeCourses = async (searchParams: GetCoursesSearchParams) => {
  if (USE_MOCK) {
    return courseResponseSchema.parse(MOCK_RETAKE);
  }

  const response = await api.get('courses/retake', { timeout: false, searchParams }).json();
  return courseResponseSchema.parse(response);
};

export const getMajorPrerequisiteCourses = async (searchParams: GetCoursesSearchParams) => {
  if (USE_MOCK) {
    return courseResponseSchema.parse(MOCK_MAJOR_PREREQUISITE);
  }

  const response = await api
    .get('courses/major/prerequisite', { timeout: false, searchParams })
    .json();
  return courseResponseSchema.parse(response);
};

export const getDoubleMajorCourses = async (searchParams: GetCoursesSearchParams) => {
  if (USE_MOCK) {
    return courseResponseSchema.parse(MOCK_DOUBLE_MAJOR);
  }

  const response = await api.get('courses/major/double', { timeout: false, searchParams }).json();
  return courseResponseSchema.parse(response);
};

export const getMinorCourses = async (searchParams: GetCoursesSearchParams) => {
  if (USE_MOCK) {
    return courseResponseSchema.parse(MOCK_MINOR);
  }

  const response = await api.get('courses/minor', { timeout: false, searchParams }).json();
  return courseResponseSchema.parse(response);
};

export const getTeachingCertificateCourses = async (searchParams: GetCoursesSearchParams) => {
  if (USE_MOCK) {
    return courseResponseSchema.parse(MOCK_TEACHING_CERTIFICATE);
  }

  const response = await api
    .get('courses/teaching-certificate', { timeout: false, searchParams })
    .json();
  return courseResponseSchema.parse(response);
};

export const getOtherMajorElectiveCourses = async (searchParams: GetCoursesSearchParams) => {
  if (USE_MOCK) {
    return courseResponseSchema.parse(MOCK_MAJOR_ELECTIVE);
  }

  const response = await api
    .get('courses/major/elective/other', { timeout: false, searchParams })
    .json();
  return courseResponseSchema.parse(response);
};

export const getSearchedCourses = async (searchKeyword: string) => {
  if (searchKeyword === '') {
    return [];
  }

  if (USE_MOCK) {
    const parsed = courseResponseSchema.parse(MOCK_MAJOR_ELECTIVE);
    return parsed.result.filter((course) => course.name.includes(searchKeyword));
  }

  const response = await api.get('courses/search', { searchParams: { q: searchKeyword } }).json();
  return paginatedCourseResponseSchema.parse(response).result.content;
};
