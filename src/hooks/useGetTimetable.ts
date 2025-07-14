import { useSuspenseQuery } from '@tanstack/react-query';

import api from '../api/client';
import { timetableResponseSchema } from '../schemas/timetableSchema';

export const useGetTimetable = (timetableId: number) => {
  return useSuspenseQuery({
    queryKey: ['timetable', timetableId],
    queryFn: async () => {
      const response = await api.get(`timetables/${timetableId}`, { timeout: false }).json();
      return timetableResponseSchema.parse(response);
    },
    select: (data) => data.result,
    staleTime: Infinity,
  });
};
