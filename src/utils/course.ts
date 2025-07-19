import { Course } from '@/schemas/courseSchema';

export const isSameCourse = (a: Course, b: Course) =>
  a.courseName === b.courseName && a.professorName === b.professorName;
