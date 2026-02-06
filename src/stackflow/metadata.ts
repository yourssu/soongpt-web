import { z } from 'zod/v4';

import { zDecoder } from '@/stackflow/utils/zDecoder';
import { CourseSelectionStepType } from '@/types/course';
import { Prettify } from '@/utils/type';

type ActivityDescriptionItem = {
  schema: z.ZodObject;
  url: string;
};

/**
 * **추후 코드젠의 용이성을 위해 모든 액티비티의 이름은 snake_case로 작성해요.**
 */
export const activityDescription = {
  course_search: {
    schema: z.object({
      selectedCourseCodes: zDecoder.numArray(),
      totalSelectedPoints: zDecoder.num(),
    }),
    url: '/course-search',
  },
  course_selection: {
    schema: z.object({
      type: zDecoder.enum(CourseSelectionStepType).optional(),
    }),
    url: '/course-selection',
  },
  general_elective_selection: {
    schema: z.object({}),
    url: '/general-elective-selection',
  },
  onboarding: {
    schema: z.object({
      grade: zDecoder.num(),
      semester: zDecoder.num(),
      schoolId: zDecoder.num(),
      department: zDecoder.str(),
      subDepartment: zDecoder.str().optional(),
      teachTrainingCourse: zDecoder.bool().default(false),
    }),
    url: '/onboarding',
  },
  landing: {
    schema: z.object({}),
    url: '/landing',
  },
  timetable_suggest: {
    schema: z.object({
      source: zDecoder.enum(['mock', 'api']).optional(),
    }),
    url: '/timetable-suggest',
  },
  draft_timetable: {
    schema: z.object({}),
    url: '/draft-timetable',
  },
  timetable_result: {
    schema: z.object({
      timetableId: zDecoder.num(),
    }),
    url: '/timetable-result',
  },
  chapel_selection: {
    schema: z.object({
      timetableId: zDecoder.num().optional(),
    }),
    url: '/chapel-selection',
  },
  waitlist: {
    schema: z.object({}),
    url: '/',
  },
} as const satisfies Record<string, ActivityDescriptionItem>;

export type ActivityName = keyof typeof activityDescription;

export type ActivityParams<T extends ActivityName> = Prettify<
  z.output<(typeof activityDescription)[T]['schema']>
>;
