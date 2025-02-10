import { useMutation } from '@tanstack/react-query';
import api from '../api/client';

import { StudentTimetable } from '../schemas/studentSchema';
import { timetableArrayResponseSchema } from '../schemas/timetableSchema';
import { useFlow } from '../stackflow.ts';

export const usePostTimetable = () => {
  const { pop } = useFlow();

  return useMutation({
    mutationKey: ['timetables'],
    mutationFn: async (student: StudentTimetable) => {
      const response = await api
        .post('timetables', {
          json: student,
        })
        .json();

      return timetableArrayResponseSchema.parse(response);
    },
    onError: () => pop(),
  });
};
