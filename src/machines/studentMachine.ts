import { assign, setup } from 'xstate';
import { Grade } from '../schemas/studentSchema';

type Context = {
  department: string; // 학과
  admissionYear: number; // 입학년도
  grade: Grade; // 학년
  chapel: boolean; // 채플 수강 여부
};

type Event =
  | { type: '학과입력완료'; payload: { department: string } }
  | { type: '입학년도입력완료'; payload: { admissionYear: number } }
  | { type: '학년입력완료'; payload: { grade: Grade } }
  | { type: '채플수강여부입력완료'; payload: { chapel: boolean } };

const studentMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Event,
  },
}).createMachine({
  id: 'student',
  initial: '학과입력',
  context: {
    department: '',
    admissionYear: 0,
    grade: 1,
    chapel: true,
  },
  on: {
    학과입력완료: {
      actions: assign({
        department: ({ event }) => event.payload.department,
      }),
    },
    입학년도입력완료: {
      actions: assign({
        admissionYear: ({ event }) => event.payload.admissionYear,
      }),
    },
    학년입력완료: {
      actions: assign({
        grade: ({ event }) => event.payload.grade,
      }),
    },
    채플수강여부입력완료: {
      actions: assign({
        chapel: ({ event }) => event.payload.chapel,
      }),
    },
  },
  states: {
    학과입력: {
      on: {
        학과입력완료: {
          target: '입학년도입력',
          actions: assign({
            department: ({ event }) => event.payload.department,
          }),
        },
      },
    },
    입학년도입력: {
      on: {
        입학년도입력완료: {
          target: '학년입력',
          actions: assign({
            admissionYear: ({ event }) => event.payload.admissionYear,
          }),
        },
      },
    },
    학년입력: {
      on: {
        학년입력완료: {
          target: '채플수강여부입력',
          actions: assign({
            grade: ({ event }) => event.payload.grade,
          }),
        },
      },
    },
    채플수강여부입력: {
      on: {
        채플수강여부입력완료: {
          actions: assign({
            chapel: ({ event }) => event.payload.chapel,
          }),
        },
      },
    },
  },
});

export default studentMachine;
