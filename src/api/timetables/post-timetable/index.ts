import { api } from '@/api/client';
import { TimetableArrayResponseSchema } from '@/schemas/timetableSchema';
import { TimetablePayloadType } from '@/types/timetablePayload';

export const postTimetable = async (payload: TimetablePayloadType) => {
  const response = await api
    .post('timetables', {
      json: payload,
      timeout: false,
    })
    .json();

  return TimetableArrayResponseSchema.parse(response);
};
