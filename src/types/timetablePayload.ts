import { RecommendationStatusType } from '@/schemas/timetableRecommendationSchema';
import { TimetableType } from '@/schemas/timetableSchema';
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

export type TimetableRecommendationOptions = {
  mockStatus?: RecommendationStatusType;
};
