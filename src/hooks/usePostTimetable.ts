import { useMutation } from '@tanstack/react-query';
import api from '../api/client';

import { StudentTimetable } from '../schemas/studentSchema';
import { TimetableArrayResponse, timetableArrayResponseSchema } from '../schemas/timetableSchema';
import { SoongptError, soongptErrorSchema } from '../schemas/errorSchema.ts';
import { HTTPError } from 'ky';
import { ZodError } from 'zod';

async function transformError(e: Error): Promise<SoongptError> {
  if (!(e instanceof HTTPError))
    throw {
      message: 'Unknown',
      status: 500,
      timestamp: new Date(),
    };
  return await e.response
    .json()
    .then((res) => soongptErrorSchema.parse(res))
    .catch((err) => {
      if (err instanceof ZodError)
        return {
          message: 'ZodError',
          status: 500,
          timestamp: new Date(),
        };
      if (err instanceof HTTPError)
        return {
          message: 'Unknown',
          status: 500,
          timestamp: new Date(),
        };
      return {
        message: 'Unknown',
        status: 500,
        timestamp: new Date(),
      };
    });
}

export const usePostTimetable = () => {
  return useMutation<TimetableArrayResponse, SoongptError, StudentTimetable>({
    mutationKey: ['timetables'],
    mutationFn: async (student: StudentTimetable) => {
      const response = await api
        .post('timetables', {
          json: student,
        })
        .json()
        .catch(async (e: HTTPError) => {
          throw await transformError(e);
        });

      return timetableArrayResponseSchema.parse(response);
    },
  });
};
