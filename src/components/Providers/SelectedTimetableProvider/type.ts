import { Dispatch, SetStateAction } from 'react';

import { TimetableCourseType, TimetableType } from '@/schemas/timetableSchema';

export type SelectedTimetableContextValue = {
  selectedChapelCourse: null | TimetableCourseType;
  selectedGeneralElectives: TimetableCourseType[];
  selectedTimetable: null | TimetableType;
  setSelectedChapelCourse: Dispatch<SetStateAction<null | TimetableCourseType>>;
  setSelectedGeneralElectives: Dispatch<SetStateAction<TimetableCourseType[]>>;
  setSelectedTimetable: Dispatch<SetStateAction<null | TimetableType>>;
};
