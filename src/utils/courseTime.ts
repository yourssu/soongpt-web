import { CourseTimeType } from '@/types/course';

const COURSE_TIME_REGEX = /([월화수목금토일])\s*(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/;
const CLASSROOM_REGEX = /\(([^)]+)\)/;

export const parseCourseScheduleRoom = (scheduleRoom?: null | string): CourseTimeType[] => {
  if (!scheduleRoom) {
    return [];
  }

  return scheduleRoom
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const timeMatch = line.match(COURSE_TIME_REGEX);
      if (!timeMatch) {
        return null;
      }

      const [, week, start, end] = timeMatch;
      const classroomMatch = line.match(CLASSROOM_REGEX);

      return {
        week,
        start,
        end,
        classroom: classroomMatch?.[1] ?? '',
      } satisfies CourseTimeType;
    })
    .filter((value): value is CourseTimeType => value !== null);
};

export const formatCourseTimeSummary = (courseTimes: CourseTimeType[]) => {
  if (courseTimes.length === 0) {
    return '시간 미정';
  }

  const { week, start, end } = courseTimes[0];
  return `${week} ${start} ~ ${end}`;
};
