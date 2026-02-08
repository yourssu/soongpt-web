import { api } from '@/api/client';
import {
  TimetableFinalizeResponseSchema,
  TimetableFinalizeResponseType,
} from '@/api/timetables/post-finalize-timetable/response';
import { FinalizeTimetablePayloadType } from '@/types/timetablePayload';

export const postFinalizeTimetable = async (
  payload: FinalizeTimetablePayloadType,
): Promise<TimetableFinalizeResponseType> => {
  const response = await api
    .post('timetables/finalize', {
      json: payload,
      timeout: false,
    })
    .json();

  return TimetableFinalizeResponseSchema.parse(response);
};
