import { api } from '@/api/client';
import {
  FinalTimetableRecommendationResponseSchema,
  FinalTimetableRecommendationResponseType,
} from '@/api/timetables/post-timetable-recommendation/response';
import {
  TimetablePartialSelectionPayloadType,
  TimetableRecommendationOptions,
} from '@/types/timetablePayload';

export const postTimetableRecommendation = async (
  payload: TimetablePartialSelectionPayloadType,
  options?: TimetableRecommendationOptions,
): Promise<FinalTimetableRecommendationResponseType> => {
  const response = await api
    .post('timetables/final-recommendation', {
      json: payload,
      searchParams: options?.mockStatus ? { mockStatus: options.mockStatus } : undefined,
      timeout: false,
    })
    .json();

  return FinalTimetableRecommendationResponseSchema.parse(response);
};
