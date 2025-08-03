import { useMutationState } from '@tanstack/react-query';

import { TimetableMutationState } from '../type';

export const useLatestTimetableMutationState = (): TimetableMutationState | undefined => {
  const timetableMutation = useMutationState<TimetableMutationState>({
    filters: { mutationKey: ['timetables'] },
  });

  if (timetableMutation.length === 0) {
    return undefined;
  }

  return timetableMutation[timetableMutation.length - 1];
};
