import { defineConfig } from '@stackflow/config';
import { z } from 'zod/v4';

import { activityDescription, ActivityDescriptionItem, ActivityName } from '@/stackflow/metadata';
import { handleError } from '@/utils/error';
import { objectEntries } from '@/utils/object';

export const stackflowTransitionDuration = 350;

export const stackflowConfig = defineConfig({
  activities: objectEntries(
    activityDescription as Record<ActivityName, ActivityDescriptionItem>,
  ).map(([name, { schema, url, onParseError }]) => ({
    name,
    route: {
      path: url,
      decode: (params) => {
        try {
          return schema.parse(params);
        } catch (e) {
          const { type, error } = handleError(e);
          if (type === 'ZodError' && onParseError) {
            return onParseError(error) ?? {};
          }
          throw e;
        }
      },
    },
    // loader:
  })),
  transitionDuration: stackflowTransitionDuration,
});

type ActivityDescription = typeof activityDescription;
type ExtendedRegister = {
  [K in keyof ActivityDescription]: z.output<ActivityDescription[K]['schema']>;
};
declare module '@stackflow/config' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Register extends ExtendedRegister {}
}
