import { useState } from 'react';

import { SelectedTimetableContext } from '@/components/Providers/SelectedTimetableProvider/context';
import { SelectedTimetableContextValue } from '@/components/Providers/SelectedTimetableProvider/type';
import { TimetableCourseType, TimetableType } from '@/schemas/timetableSchema';

export const SelectedTimetableProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const [selectedTimetable, setSelectedTimetable] = useState<null | TimetableType>(null);
  const [selectedGeneralElectives, setSelectedGeneralElectives] = useState<TimetableCourseType[]>(
    [],
  );
  const [selectedChapelCourse, setSelectedChapelCourse] = useState<null | TimetableCourseType>(
    null,
  );

  const value: SelectedTimetableContextValue = {
    selectedTimetable,
    setSelectedTimetable,
    selectedGeneralElectives,
    setSelectedGeneralElectives,
    selectedChapelCourse,
    setSelectedChapelCourse,
  };

  return (
    <SelectedTimetableContext.Provider value={value}>{children}</SelectedTimetableContext.Provider>
  );
};
