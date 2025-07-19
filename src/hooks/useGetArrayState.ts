import { useMemo } from 'react';

export type ArrayState = 'EMPTY' | 'FILLED';

export const useGetArrayState = <T>(array: T[]) => {
  return useMemo((): ArrayState => (array.length === 0 ? 'EMPTY' : 'FILLED'), [array]);
};
