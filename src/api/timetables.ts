import { api } from '@/api/client';
import { StudentTimetable } from '@/schemas/studentSchema';
import { timetableArrayResponseSchema, timetableResponseSchema } from '@/schemas/timetableSchema';
import { transformError } from '@/utils/error';

export const getTimetableById = async (timetableId: number) => {
  const response = await api.get(`timetables/${timetableId}`, { timeout: false }).json();
  return timetableResponseSchema.parse(response);
};

export const postTimetable = async (payload: StudentTimetable) => {
  const response = await api
    .post('timetables', {
      json: payload,
      timeout: false,
    })
    .json()
    .catch(async (e) => {
      throw await transformError(e);
    });

  return timetableArrayResponseSchema.parse(response);
};
