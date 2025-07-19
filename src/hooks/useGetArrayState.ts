import { useMemo } from 'react';

import { ArrayState } from '@/types/common';

export const useGetArrayState = <T>(array: T[]) => {
  return useMemo((): ArrayState => (array.length === 0 ? 'EMPTY' : 'FILLED'), [array]);
};
