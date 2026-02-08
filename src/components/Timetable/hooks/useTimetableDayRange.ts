import { TimetableCourseType } from '@/types/timetable';

export const timetableBaseDays = ['월', '화', '수', '목', '금'];

export const useTimetableDayRange = (courses: TimetableCourseType[]) => {
  const saturday = '토';

  const isCourseInSaturday = ({ courseTimes }: TimetableCourseType) =>
    courseTimes.some(({ week }) => week === saturday);

  const hasAnyCourseInSaturday = courses.some(isCourseInSaturday);

  return hasAnyCourseInSaturday ? [...timetableBaseDays, saturday] : timetableBaseDays;
};
