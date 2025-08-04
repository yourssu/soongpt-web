import { z } from 'zod/v4';

import { CourseSchema } from '@/schemas/courseSchema';
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
      selectedCourses: z.array(CourseSchema),
    }),
    url: '/course-search',
  },
  course_selection: {
    schema: z.object({
      type: z.enum(CourseSelectionStepType).optional(),
    }),
    url: '/course-selection',
  },
  desired_credit: {
    schema: z.object({
      codes: z.array(z.number()),
      generalRequiredCodes: z.array(z.number()),
      majorElectiveCodes: z.array(z.number()),
      majorRequiredCodes: z.array(z.number()),
      selectedTotalPoints: z.number(),
    }),
    url: '/desired-credit',
  },
  onboarding: {
    schema: z.object({}),
    url: '/',
  },
  timetable_selection: {
    schema: z.object({}),
    url: '/time-table-selection',
  },
} as const satisfies Record<string, ActivityDescriptionItem>;

export type ActivityName = keyof typeof activityDescription;

export type ActivityParams<T extends ActivityName> = Prettify<
  z.output<(typeof activityDescription)[T]['schema']>
>;
