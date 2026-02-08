import { useMemo, useState } from 'react';

import { SelectedTimetableContext } from '@/components/Providers/SelectedTimetableProvider/context';
import { SelectedTimetableContextValue } from '@/components/Providers/SelectedTimetableProvider/type';
import { CourseType } from '@/schemas/courseSchema';
import {
  DeletableCourseDtoType,
  RecommendationDtoType,
  RecommendationStatusType,
} from '@/schemas/timetableRecommendationSchema';
import { TimetableCourseType, TimetableType } from '@/schemas/timetableSchema';
import { TimetablePartialSelectionPayloadType } from '@/types/timetablePayload';
import { mergeTimetableCourses } from '@/utils/timetableSelection';

export const SelectedTimetableProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const [partialSelection, setPartialSelection] =
    useState<null | TimetablePartialSelectionPayloadType>(null);
  const [recommendationStatus, setRecommendationStatus] = useState<null | RecommendationStatusType>(
    null,
  );
  const [recommendedPrimaryTimetable, setRecommendedPrimaryTimetable] =
    useState<null | TimetableType>(null);
  const [recommendedAlternatives, setRecommendedAlternatives] = useState<RecommendationDtoType[]>(
    [],
  );
  const [deletableConflictCourses, setDeletableConflictCourses] = useState<
    DeletableCourseDtoType[]
  >([]);
  const [availableGeneralElectives, setAvailableGeneralElectives] = useState<CourseType[]>([]);
  const [availableChapels, setAvailableChapels] = useState<CourseType[]>([]);

  const [selectedTimetable, setSelectedTimetable] = useState<null | TimetableType>(null);
  const [selectedGeneralElectives, setSelectedGeneralElectives] = useState<TimetableCourseType[]>(
    [],
  );
  const [selectedChapelCourse, setSelectedChapelCourse] = useState<null | TimetableCourseType>(
    null,
  );
  const [finalizedTimetable, setFinalizedTimetable] = useState<null | TimetableType>(null);

  const previewTimetable = useMemo(() => {
    if (!selectedTimetable) {
      return null;
    }

    if (selectedGeneralElectives.length === 0 && !selectedChapelCourse) {
      return selectedTimetable;
    }

    return mergeTimetableCourses(selectedTimetable, selectedGeneralElectives, selectedChapelCourse);
  }, [selectedChapelCourse, selectedGeneralElectives, selectedTimetable]);

  const value: SelectedTimetableContextValue = {
    partialSelection,
    setPartialSelection,
    recommendationStatus,
    setRecommendationStatus,
    recommendedPrimaryTimetable,
    setRecommendedPrimaryTimetable,
    recommendedAlternatives,
    setRecommendedAlternatives,
    deletableConflictCourses,
    setDeletableConflictCourses,
    availableGeneralElectives,
    setAvailableGeneralElectives,
    availableChapels,
    setAvailableChapels,
    selectedTimetable,
    setSelectedTimetable,
    selectedGeneralElectives,
    setSelectedGeneralElectives,
    selectedChapelCourse,
    setSelectedChapelCourse,
    previewTimetable,
    finalizedTimetable,
    setFinalizedTimetable,
  };

  return (
    <SelectedTimetableContext.Provider value={value}>{children}</SelectedTimetableContext.Provider>
  );
};
