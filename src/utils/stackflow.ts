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
