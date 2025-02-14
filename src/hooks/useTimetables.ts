import { MutationState, useMutationState } from '@tanstack/react-query';
import { TimetableArrayResponse } from '../schemas/timetableSchema.ts';
import { SoongptError } from '../schemas/errorSchema.ts';
import { use, useMemo } from 'react';
import { Timetable } from '../schemas/timetableSchema.ts';

export const useTimetables = () => {
  const timetableMutation = useMutationState<MutationState<TimetableArrayResponse, SoongptError>>({
    filters: { mutationKey: ['timetables'] },
  });

  const latestMutation = timetableMutation[timetableMutation.length - 1];

  const promise = useMemo(() => {
    if (!latestMutation) {
      return Promise.resolve<Timetable[]>([]);
    }

    const { status, data, error } = latestMutation;

    switch (status) {
      case 'success': {
        if (!data) {
          return Promise.resolve<Timetable[]>([]);
        }
        return Promise.resolve(data.result.timetables);
      }
      case 'error':
        return Promise.reject(error);
      case 'pending':
        return new Promise<Timetable[]>((resolve) => {
          queueMicrotask(() => {
            if (!data) {
              resolve([]);
              return;
            }
            resolve(data.result.timetables);
          });
        });
      default:
        return Promise.resolve<Timetable[]>([]);
    }
  }, [latestMutation]);

  return use(promise);
};
