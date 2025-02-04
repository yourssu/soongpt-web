import { CourseSelection, CourseType } from '../type/course.type.ts';

export const courseSelection: { [key in CourseType]: CourseSelection } = {
  majorRequired: {
    title: '이번 학기에 이수해야 하는\n전공필수과목이에요.',
    description: '잘못되었다면 이수할 과목만 선택해주세요!',
    next: 'generalRequired',
    progress: 33,
    courses: [
      {
        courseId: '1',
        name: '자료구조',
        professors: ['나현숙'],
        credit: 3,
      },
      {
        courseId: '2',
        name: '선형대수',
        professors: ['나현숙, 박중석'],
        credit: 2,
      },
      {
        courseId: '3',
        name: '자료구조',
        professors: ['나현숙, 박중석'],
        credit: 2,
      },
      {
        courseId: '4',
        name: '객체 지향 프로그래밍',
        professors: ['나현숙, 박중석'],
        credit: 2,
      },
      {
        courseId: '5',
        name: '객체 지향 프로그래밍',
        professors: ['나현숙, 박중석'],
        credit: 2,
      },
    ],
  },
  generalRequired: {
    title: '이번 학기에 이수해야 하는\n교양필수과목이에요.',
    description: '잘못되었다면 이수할 과목만 선택해주세요!',
    next: 'majorElective',
    progress: 66,
    courses: [
      {
        courseId: '11',
        name: 'SW와 AI',
        professors: ['나현숙'],
        credit: 3,
      },
      {
        courseId: '12',
        name: '인간과 성서',
        professors: ['나현숙, 박중석'],
        credit: 2,
      },
      {
        courseId: '13',
        name: '인문적 상상력과 소통',
        professors: ['나현숙, 박중석'],
        credit: 2,
      },
    ],
  },
  majorElective: {
    title: '이번 학기에 이수할\n전공선택과목을 알려주세요!',
    description: '타학년 전공선택과목도 선택할 수 있어요.',
    next: null,
    progress: 100,
    courses: [
      {
        courseId: '1',
        name: '자료구조',
        professors: ['나현숙'],
        credit: 3,
      },
      {
        courseId: '2',
        name: '선형대수',
        professors: ['나현숙, 박중석'],
        credit: 2,
      },
      {
        courseId: '3',
        name: '자료구조',
        professors: ['나현숙, 박중석'],
        credit: 2,
      },
      {
        courseId: '4',
        name: '객체 지향 프로그래밍',
        professors: ['나현숙, 박중석'],
        credit: 2,
      },
      {
        courseId: '5',
        name: '객체 지향 프로그래밍',
        professors: ['나현숙, 박중석'],
        credit: 2,
      },
    ],
  },
};
