import { range } from 'es-toolkit';
import { max } from 'es-toolkit/compat';

import { parseCourseTime } from '@/components/Timetable/utils/parseCourseTime';
import { TimetableCourseType } from '@/schemas/timetableSchema';

export const useTimetableHourRange = (courses: TimetableCourseType[]) => {
  const earliestHour = 9;

  const getLatestHour = () => {
    const allHours = courses
      .flatMap(({ courseTimes }) => courseTimes)
      .map(({ end }) => parseCourseTime(end).hour)
      .filter((hour) => !isNaN(hour));

    return max(allHours) ?? earliestHour;
  };

  return range(earliestHour, getLatestHour() + 1);
};
