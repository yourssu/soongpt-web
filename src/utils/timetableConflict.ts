import { TimetableCourseType } from '@/types/timetable';

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const isCourseTimeConflict = (a: TimetableCourseType, b: TimetableCourseType) => {
  return a.courseTimes.some((timeA) =>
    b.courseTimes.some((timeB) => {
      if (timeA.week !== timeB.week) {
        return false;
      }

      const aStart = toMinutes(timeA.start);
      const aEnd = toMinutes(timeA.end);
      const bStart = toMinutes(timeB.start);
      const bEnd = toMinutes(timeB.end);

      return aStart < bEnd && bStart < aEnd;
    }),
  );
};

export const hasCourseConflictWithAny = (
  target: TimetableCourseType,
  courses: TimetableCourseType[],
) => {
  return courses.some((course) => isCourseTimeConflict(target, course));
};
