import { z, ZodError } from 'zod/v4';

import { zDecoder } from '@/stackflow/utils/zDecoder';
import { CourseSelectionStepType } from '@/types/course';
import { EmptyObjectType, Prettify } from '@/utils/type';

export type ActivityDescriptionItem = {
  onParseError?: (error: ZodError) => EmptyObjectType | void;
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
  desired_credit: {
    schema: z.object({
      codes: zDecoder.numArray(),
      generalRequiredCodes: zDecoder.numArray(),
      majorElectiveCodes: zDecoder.numArray(),
      majorRequiredCodes: zDecoder.numArray(),
      selectedTotalPoints: zDecoder.num(),
    }),
    url: '/desired-credit',
  },
  onboarding: {
    schema: z.object({}),
    url: '/',
  },
  timetable_selection: {
    schema: z.object({
      codes: zDecoder.numArray(),
      generalRequiredCodes: zDecoder.numArray(),
      majorElectiveCodes: zDecoder.numArray(),
      majorRequiredCodes: zDecoder.numArray(),
      generalElectivePoint: zDecoder.num(),
      preferredGeneralElectives: zDecoder.strArray(),
    }),
    onParseError: () => {
      window.location.href = '/';
    },
    url: '/time-table-selection',
  },
} as const satisfies Record<string, ActivityDescriptionItem>;

export type ActivityName = keyof typeof activityDescription;

export type ActivityParams<T extends ActivityName> = Prettify<
  z.output<(typeof activityDescription)[T]['schema']>
>;
