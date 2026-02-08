import { api } from '@/api/client';
import {
  TimetableAvailableCoursesResponseSchema,
  TimetableAvailableCoursesResponseType,
} from '@/schemas/timetableAvailableCoursesSchema';
import {
  TimetableFinalizeResponseSchema,
  TimetableFinalizeResponseType,
} from '@/schemas/timetableFinalizeSchema';
import {
  FinalTimetableRecommendationResponseSchema,
  FinalTimetableRecommendationResponseType,
  RecommendationStatusType,
} from '@/schemas/timetableRecommendationSchema';
import {
  TimetableArrayResponseSchema,
  TimetableResponseSchema,
  TimetableType,
} from '@/schemas/timetableSchema';
import { StudentType } from '@/types/student';

export type TimetablePayloadType = StudentType & {
  codes: number[];
  generalElectivePoint: number;
  generalRequiredCodes: number[];
  majorElectiveCodes: number[];
  majorRequiredCodes: number[];
  preferredGeneralElectives: string[];
};

export type TimetablePartialSelectionPayloadType = TimetablePayloadType & {
  selectedChapelCode?: number;
  selectedGeneralElectiveCodes: number[];
};

export type FinalizeTimetablePayloadType = {
  partialSelection: TimetablePartialSelectionPayloadType;
  timetable: TimetableType;
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

export const postTimetableRecommendation = async (
  payload: TimetablePartialSelectionPayloadType,
  options?: {
    mockStatus?: RecommendationStatusType;
  },
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
