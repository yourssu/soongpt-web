import { useMemo } from 'react';
import { ArrayState } from '../type/common.type.ts';

export const useGetArrayState = (array: unknown[]) => {
  return useMemo((): ArrayState => (array.length === 0 ? 'EMPTY' : 'FILLED'), [array]);
};
