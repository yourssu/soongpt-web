import { api } from '@/api/client';
import { TimetableArrayResponseSchema, TimetableResponseSchema } from '@/schemas/timetableSchema';
import { StudentType } from '@/types/student';

export type TimetablePayloadType = StudentType & {
  codes: number[];
  generalElectivePoint: number;
  generalRequiredCodes: number[];
  majorElectiveCodes: number[];
  majorRequiredCodes: number[];
  preferredGeneralElectives: string[];
};

export const getTimetableById = async (timetableId: number) => {
  const response = await api.get(`timetables/${timetableId}`, { timeout: false }).json();
  return TimetableResponseSchema.parse(response);
};

export const postTimetable = async (payload: TimetablePayloadType) => {
  const response = await api
    .post('timetables', {
      json: payload,
      timeout: false,
    })
    .json();

  return TimetableArrayResponseSchema.parse(response);
};
