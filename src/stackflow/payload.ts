/* eslint-disable @typescript-eslint/naming-convention */

import { CourseType } from '@/schemas/courseSchema';

type noopPayload = never;

// Todo: type driven from ActivityName?
export type ActivityNameWithPayload = {
  course_search: {
    actionType: '삭제' | '추가';
    course: CourseType;
  };
  course_selection: noopPayload;
  desired_credit: noopPayload;
  onboarding: noopPayload;
  timetable_selection: noopPayload;
};
