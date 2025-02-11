import { useMemo } from 'react';

interface UseGetArrayStateProps {
  array: unknown[];
}

export const useGetArrayState = ({ array }: UseGetArrayStateProps) => {
  return useMemo(() => (array.length === 0 ? 'EMPTY' : 'FILLED'), [array]);
};
