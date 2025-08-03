import { CourseType } from '@/schemas/courseSchema';

export const extractComparableCourseCode = (code: number) => {
  return code.toString().slice(0, 8);
};

export const isSameCourse = (a: CourseType, b: CourseType) => {
  return extractComparableCourseCode(a.code) === extractComparableCourseCode(b.code);
};

export const isSameCourseCode = (a: number, b: number) => {
  return extractComparableCourseCode(a) === extractComparableCourseCode(b);
};
