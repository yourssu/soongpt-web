import { CourseType } from '@/types/course';
import { TimetableCourseType, TimetableType } from '@/types/timetable';
import { parseCourseScheduleRoom } from '@/utils/courseTime';

export const toTimetableCourse = (course: CourseType): TimetableCourseType => {
  return {
    ...course,
    courseTimes: parseCourseScheduleRoom(course.scheduleRoom),
  };
};

export const mergeTimetableCourses = (
  base: TimetableType,
  additions: TimetableCourseType[],
  chapel?: null | TimetableCourseType,
): TimetableType => {
  const additionCodes = new Set<number>([
    ...(chapel ? [chapel.code] : []),
    ...additions.map((course) => course.code),
  ]);

  const baseCourses = base.courses.filter((course) => !additionCodes.has(course.code));

  return {
    ...base,
    courses: [...baseCourses, ...additions, ...(chapel ? [chapel] : [])],
  };
};
