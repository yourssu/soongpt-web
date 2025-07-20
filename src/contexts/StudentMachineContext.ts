import { createActorContext } from '@xstate/react';
import { assign, setup } from 'xstate';

import { Grade } from '@/schemas/studentSchema';

export type StudentMachineContextType = {
  admissionYear: number; // 입학년도
  chapel: boolean; // 채플 수강 여부
  department: string; // 학과
  grade: Grade; // 학년
};

type Event =
  | { payload: { admissionYear: number }; type: '입학년도입력완료' }
  | { payload: { chapel: boolean }; type: '채플수강여부입력완료' }
  | { payload: { department: string }; type: '학과입력완료' }
  | { payload: { grade: Grade }; type: '학년입력완료' };

const studentMachine = setup({
  types: {
    context: {} as StudentMachineContextType,
    events: {} as Event,
  },
}).createMachine({
  id: 'student',
  initial: '학과입력',
  context: {
    department: '',
    admissionYear: 0,
    grade: 0,
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

// localStorage에 저장된 state를 가져옴
const stateString = localStorage.getItem('student');
// 가져온 state를 JSON.parse로 변환
const restoredState = stateString ? JSON.parse(stateString) : undefined;

export const StudentMachineContext = createActorContext(studentMachine, {
  snapshot: restoredState,
});
