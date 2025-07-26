import { useSuspenseQuery } from '@tanstack/react-query';

import { Course } from '@/schemas/courseSchema';

export const searchedCoursesMock: Course[] = [
  {
    code: 1000000101,
    name: '컴퓨터구조',
    professor: ['나현숙', '김철면'],
    category: '전필',
    time: 4,
    point: 3,
    department: '컴퓨터학부',
    division: '01분반',
    field: null,
    personeel: 10,
    scheduleRoom: '',
    subCategory: null,
    target: '',
  },
  {
    code: 1000000102,
    name: '컴퓨터구조',
    professor: ['나현숙', '김철익'],
    category: '전필',
    time: 4,
    point: 3,
    department: '컴퓨터학부',
    division: '01분반',
    field: null,
    personeel: 10,
    scheduleRoom: '',
    subCategory: null,
    target: '',
  },
  {
    code: 1000000201,
    name: '컴퓨터수학1',
    professor: ['김영훈'],
    category: '전필',
    time: 3,
    point: 2,
    department: '컴퓨터학부',
    division: '01분반',
    field: null,
    personeel: 10,
    scheduleRoom: '',
    subCategory: null,
    target: '',
  },
  {
    code: 1000000301,
    name: '컴퓨터수학2',
    professor: ['박상혁'],
    category: '교필',
    time: 3,
    point: 3,
    department: '컴퓨터학부',
    division: '01분반',
    field: null,
    personeel: 10,
    scheduleRoom: '',
    subCategory: null,
    target: '',
  },
];

export const useSuspensedSearchedCoursesMock = (searchKeyword: string) => {
  const { data: searchedCourses } = useSuspenseQuery({
    queryKey: ['searched-courses', searchKeyword],
    queryFn: () => {
      /* Todo: 임시 모킹 로직 뜯어내기 */
      if (searchKeyword === '') {
        return [];
      }
      return searchedCoursesMock.filter((course) => course.name.includes(searchKeyword));
    },
  });
  return searchedCourses;
};
