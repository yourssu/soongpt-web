import { useSuspenseQuery } from '@tanstack/react-query';

import { getTimetableById } from '@/api/timetables';

export const useGetTimetable = (timetableId: number) => {
  return useSuspenseQuery({
    queryKey: ['timetable', timetableId],
    queryFn: () => getTimetableById(timetableId),
    select: (data) => data.result,
    staleTime: Infinity,
  });
};
