import { useMutation } from '@tanstack/react-query';
import api from '../api/client';

import { StudentTimetable } from '../schemas/studentSchema';
import { timetableArrayResponseSchema } from '../schemas/timeTableSchema';

export const usePostTimetable = (student: StudentTimetable) => {
  return useMutation({
    mutationKey: ['timetable', student],
    mutationFn: async () => {
      const response = await api
        .post('timetables', {
          json: student,
        })
        .json();

      return timetableArrayResponseSchema.parse(response);
    },
  });
};
