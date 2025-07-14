import { useMemo } from 'react';

import { ArrayState } from '../type/common.type.ts';

export const useGetArrayState = <T>(array: T[]) => {
  return useMemo((): ArrayState => (array.length === 0 ? 'EMPTY' : 'FILLED'), [array]);
};
