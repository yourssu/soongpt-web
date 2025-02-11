import { Course } from '../schemas/courseSchema.ts';

export const isSameCourse = (a: Course, b: Course) =>
  a.courseName === b.courseName && a.professorName === b.professorName;
