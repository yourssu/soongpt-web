import { CourseSelection, CourseType } from '../type/course.type.ts';
import { Grade } from '../schemas/studentSchema.ts';

export const courseSelection: Record<CourseType, CourseSelection> = {
  MAJOR_REQUIRED: {
    title: '이번 학기에 이수해야 하는\n전공필수과목이에요.',
    description: '잘못되었다면 이수할 과목만 선택해주세요!',
    okText: '확인했어요',
    next: 'GENERAL_REQUIRED',
    progress: 33,
  },
  GENERAL_REQUIRED: {
    title: '이번 학기에 이수해야 하는\n교양필수과목이에요.',
    description: '잘못되었다면 이수할 과목만 선택해주세요!',
    next: 'MAJOR_ELECTIVE',
    progress: 66,
    okText: '확인했어요',
  },
  MAJOR_ELECTIVE: {
    title: '이번 학기에 이수할\n전공선택과목을 알려주세요!',
    description: '타학년 전공선택과목도 선택할 수 있어요.',
    next: null,
    progress: 100,
    okText: '다 선택했어요',
  },
};

export const gradeSelection: Grade[][] = [[1], [2], [3], [4, 5]];
