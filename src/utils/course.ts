import { Course } from '@/schemas/courseSchema';

export const extractComparableCourseCode = (course: Course) => {
  const code = course.code.toString().slice(0, 8);
  return code;
};

export const isSameCourse = (a: Course, b: Course) => {
  return extractComparableCourseCode(a) === extractComparableCourseCode(b);
};
