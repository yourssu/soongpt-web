import { uniq } from 'es-toolkit';
import { uniqBy } from 'lodash';
import { useMemo } from 'react';

import { Course } from '@/schemas/courseSchema';
import { extractComparableCourseCode, isSameCourse } from '@/utils/course';

/** 
  모든 분반들을 합쳐 고유한 과목들을 배열로 만들어요.
  - 분반들의 교수님 이름들은 배열로 만들어 반환해요.
  - 나머지 값들은 아무거나 골라서 반환해요.
*/
export const useCombinedCourses = (courses: Course[]) => {
  const uniqueCodeCourses = useMemo(
    () => uniqBy(courses, (c) => extractComparableCourseCode(c.code)),
    [courses],
  );

  const getSameCodeProfessorsOf = (course: Course) => {
    const sameCodeCourses = courses.filter((c) => isSameCourse(c, course));
    const sameCodeProfessors = sameCodeCourses.flatMap(({ professor }) => professor);
    return uniq(sameCodeProfessors);
  };

  const uniqueCoursesWithProfessorCombined = uniqueCodeCourses.map((uniqueCourse) => ({
    ...uniqueCourse,
    professor: getSameCodeProfessorsOf(uniqueCourse),
  }));

  return uniqueCoursesWithProfessorCombined;
};
