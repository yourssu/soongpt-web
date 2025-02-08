import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import { timetableResponseSchema } from '../schemas/timetableSchema';

export const useGetTimetable = (timetableId: number) => {
  return useQuery({
    queryKey: ['timetable', timetableId],
    queryFn: async () => {
      const response = await api.get(`timetables/${timetableId}`).json();

      return timetableResponseSchema.parse(response);
    },
    staleTime: Infinity,
  });
};
