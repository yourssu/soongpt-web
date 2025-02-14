import { MutationState, useMutationState } from '@tanstack/react-query';
import { TimetableArrayResponse } from '../schemas/timetableSchema.ts';
import { SoongptError } from '../schemas/errorSchema.ts';

export const useTimetables = () => {
  const timetableMutation = useMutationState<MutationState<TimetableArrayResponse, SoongptError>>({
    filters: { mutationKey: ['timetables'] },
  });

  const latestMutation = timetableMutation[timetableMutation.length - 1];

  if (!latestMutation) {
    throw new Error('No timetables mutation found');
  }

  const { status, data, error } = latestMutation;

  switch (status) {
    case 'success': {
      if (!data) {
        return [];
      }
      return data.result.timetables;
    }
    case 'error':
      throw error;
    case 'pending':
      throw new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    default:
      return [];
  }
};
