import { createContext, useContext } from 'react';

import { InjectedTimetableCourse } from '@/components/Timetable/type';
import { TimetableType } from '@/schemas/timetableSchema';

interface TimetableContextProps {
  courses: InjectedTimetableCourse[];
  dayRange: string[];
  hourRange: number[];
  isSelected?: boolean;
  timetable: TimetableType;
  totalPoint: number;
}

export const TimetableContext = createContext<TimetableContextProps>({
  dayRange: [],
  hourRange: [],
  timetable: {} as TimetableType,
  totalPoint: 0,
  isSelected: undefined,
  courses: [],
});

export const useTimetableContext = () => {
  const context = useContext(TimetableContext);

  if (!context) {
    throw new Error('useTimetableContext는 TimetableContext 하위에서 사용해주세요.');
  }

  return context;
};
