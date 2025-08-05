import { useActivity, useActivityParams } from '@stackflow/react/future';

import { activityDescription, ActivityName } from '@/stackflow/metadata';
import { objectKeys } from '@/utils/object';

export const useSafeActivityParams = <T extends ActivityName>(activityName: T) => {
  const { name } = useActivity();
  const allActivityNames = objectKeys(activityDescription);

  if (!allActivityNames.includes(activityName)) {
    throw new Error(`올바르지 않은 액티비티 이름이에요: ${activityName}`);
  }

  if (name !== activityName) {
    throw new Error(`현재 액티비티가 '${activityName}' 가 아니에요. 현재 액티비티: ${name}`);
  }

  return useActivityParams<T>();
};
