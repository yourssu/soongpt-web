export type ArrayState = 'EMPTY' | 'FILLED';

export const useGetArrayState = <T>(array: T[]) => {
  return array.length === 0 ? 'EMPTY' : 'FILLED';
};
