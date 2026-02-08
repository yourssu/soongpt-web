import { api } from '@/api/client';
import {
  TimetableAvailableCoursesResponseSchema,
  TimetableAvailableCoursesResponseType,
} from '@/api/timetables/post-available-courses/response';
import { TimetablePartialSelectionPayloadType } from '@/types/timetablePayload';

export const postAvailableCourses = async (
  payload: TimetablePartialSelectionPayloadType,
): Promise<TimetableAvailableCoursesResponseType> => {
  const response = await api
    .post('timetables/available-courses', {
      json: payload,
      timeout: false,
    })
    .json();

  return TimetableAvailableCoursesResponseSchema.parse(response);
};
