import { useMemo } from 'react';

import { Course } from '@/schemas/courseSchema';

type GroupedByFieldCourses = Record<string, Course[]>;

/**
 * 과목들을 `Course.field` 값으로 다시 그루핑해요.
 * - XXXX(YYYY) 형태인 경우는 YYYY를 기준으로 그룹지어요.
 * - XXXX 형태인 경우는 XXXX를 기준으로 그룹지어요.
 * - 빈 문자열인 경우는 `Course.name` 자체를 기준으로 그룹지어요.
 */
export const useGroupCoursesByField = (courses: Course[]): GroupedByFieldCourses => {
  return useMemo(() => {
    const group: GroupedByFieldCourses = {};

    const addToGroup = (field: string, course: Course) => {
      group[field] = [...(group[field] || []), course];
    };

    courses.forEach((course) => {
      const { field, name } = course;

      if (field === null || field === '') {
        addToGroup(name, course);
        return;
      }

      if (field.includes('(')) {
        const [, targetField] = field.split('(');
        addToGroup(targetField.replace(')', ''), course);
        return;
      }

      addToGroup(field, course);
    });

    return group;
  }, [courses]);
};
