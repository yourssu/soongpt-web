import { useMutation } from '@tanstack/react-query';
import api from '../api/client';

import { StudentTimetable } from '../schemas/studentSchema';
import { timetableArrayResponseSchema } from '../schemas/timetableSchema';
import { transformError } from '../utils/error.ts';

export const usePostTimetable = () => {
  return useMutation({
    mutationKey: ['timetables'],
    mutationFn: async (student: StudentTimetable) => {
      const response = await api
        .post('timetables', {
          json: student,
        })
        .json()
        .catch(async (e) => {
          throw await transformError(e);
        });

      return timetableArrayResponseSchema.parse(response);
    },
  });
};
