export const filterNullish = <T>(array: T[]): NonNullable<T>[] => {
  return array.filter((item) => item !== null && item !== undefined);
};
