import { Dispatch, SetStateAction } from 'react';

import { CourseType } from '@/types/course';
import { TimetableCourseType, TimetableType } from '@/types/timetable';
import { TimetablePartialSelectionPayloadType } from '@/types/timetablePayload';
import {
  DeletableCourseDtoType,
  RecommendationDtoType,
  RecommendationStatusType,
} from '@/types/timetableRecommendation';

export type SelectedTimetableContextValue = {
  availableChapels: CourseType[];
  availableGeneralElectives: CourseType[];
  deletableConflictCourses: DeletableCourseDtoType[];
  finalizedTimetable: null | TimetableType;
  partialSelection: null | TimetablePartialSelectionPayloadType;
  previewTimetable: null | TimetableType;
  recommendationStatus: null | RecommendationStatusType;
  recommendedAlternatives: RecommendationDtoType[];
  recommendedPrimaryTimetable: null | TimetableType;
  selectedChapelCourse: null | TimetableCourseType;
  selectedGeneralElectives: TimetableCourseType[];
  selectedTimetable: null | TimetableType;
  setAvailableChapels: Dispatch<SetStateAction<CourseType[]>>;
  setAvailableGeneralElectives: Dispatch<SetStateAction<CourseType[]>>;
  setDeletableConflictCourses: Dispatch<SetStateAction<DeletableCourseDtoType[]>>;
  setFinalizedTimetable: Dispatch<SetStateAction<null | TimetableType>>;
  setPartialSelection: Dispatch<SetStateAction<null | TimetablePartialSelectionPayloadType>>;
  setRecommendationStatus: Dispatch<SetStateAction<null | RecommendationStatusType>>;
  setRecommendedAlternatives: Dispatch<SetStateAction<RecommendationDtoType[]>>;
  setRecommendedPrimaryTimetable: Dispatch<SetStateAction<null | TimetableType>>;
  setSelectedChapelCourse: Dispatch<SetStateAction<null | TimetableCourseType>>;
  setSelectedGeneralElectives: Dispatch<SetStateAction<TimetableCourseType[]>>;
  setSelectedTimetable: Dispatch<SetStateAction<null | TimetableType>>;
};
