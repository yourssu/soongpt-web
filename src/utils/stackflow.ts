import { useActivity, useActivityParams } from '@stackflow/react/future';

import { activityDescription, ActivityName } from '@/stackflow/metadata';
import { objectKeys } from '@/utils/object';
import { EmptyObjectType } from '@/utils/type';

type StaticActivityComponentType<T extends { [K in keyof T]: any } = EmptyObjectType> = React.FC<{
  params: T;
}>;

type LazyActivityComponentType<T extends { [K in keyof T]: any } = EmptyObjectType> =
  React.LazyExoticComponent<StaticActivityComponentType<T>> & {
    _load?: () => Promise<{ default: StaticActivityComponentType<T> }>;
  };

/**
 * stackflow가 react19를 공식 지원하지 않아 액티비티 타입 추론에 문제가 있어요.
 *
 * `@stackflow/react` 의 `ActivityComponentType` 대신 이 타입을 사용해주세요.
 */
export type ActivityComponentType<T extends { [K in keyof T]: any } = EmptyObjectType> =
  | LazyActivityComponentType<T>
  | StaticActivityComponentType<T>;

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
