import Like from '../assets/like.svg';
import { Course } from '../schemas/courseSchema.ts';
import { Grade } from '../schemas/studentSchema.ts';
import { CourseSelectionInfo, CourseType } from '../type/course.type.ts';

export const courseSelectionInfo: Record<CourseType, CourseSelectionInfo> = {
  MAJOR_REQUIRED: {
    text: {
      FILLED: {
        title: '이번 학기에 이수해야 하는\n전공필수과목이에요.',
        description: '잘못되었다면 이수할 과목만 선택해주세요!',
        okText: '확인했어요',
      },
      EMPTY: {
        title: '이번 학기에 이수해야 하는\n전공필수과목이 없어요.',
        okText: '확인했어요',
        image: Like,
      },
    },
    next: 'GENERAL_REQUIRED',
    progress: 33,
  },
  GENERAL_REQUIRED: {
    text: {
      FILLED: {
        title: '이번 학기에 이수해야 하는\n교양필수과목이에요.',
        description: '잘못되었다면 이수할 과목만 선택해주세요!',
        okText: '확인했어요',
      },
      EMPTY: {
        title: '이번 학기에 이수해야 하는\n교양필수과목이 없어요.',
        image: Like,
        okText: '확인했어요',
      },
    },
    progress: 66,
    next: 'MAJOR_ELECTIVE',
  },
  MAJOR_ELECTIVE: {
    text: {
      FILLED: {
        title: '이번 학기에 이수할\n전공선택과목을 알려주세요!',
        description: '타학년 전공선택과목도 선택할 수 있어요.',
        okText: '다 선택했어요',
      },
      EMPTY: {
        title: '이번 학기에 이수할\n전공선택과목이 없어요.',
        description: '',
        okText: '다 선택했어요',
      },
    },
    next: null,
    progress: 100,
  },
};

export const gradeSelection: Grade[][] = [[1], [2], [3], [4, 5]];

export const emptyCourse: Course = {
  courseName: '',
  professorName: '',
  courseTime: [],
  classification: 'MAJOR_REQUIRED',
  credit: 0,
  target: [],
};
