import { InjectedTimetableCourse } from '@/components/Timetable/type';
import { parseCourseTime } from '@/components/Timetable/utils/parseCourseTime';
import { TimetableCourseType } from '@/types/timetable';

const MAX_BREAK_TIME_MINUTES = 15;

export const useBreaktimeInjectedCourses = (courses: TimetableCourseType[]) => {
  const result: InjectedTimetableCourse[] = [];

  const stringTimeToMinutes = (time: string) => {
    const { hour, minute } = parseCourseTime(time);
    return hour * 60 + minute;
  };

  courses.forEach(({ courseTimes, ...course }) => {
    /* 
        휴리스틱: courseTimes는 rusaint 내부적으로 날짜별, 시간별 오름차순 정렬이 되어있음.
      */
    const newCourse: InjectedTimetableCourse = { ...course, courseTimes: [] };

    for (let i = courseTimes.length - 1; i > 0; i--) {
      const currentCourseTime = courseTimes[i - 1];
      const nextCourseTime = courseTimes[i];

      if (currentCourseTime.week !== nextCourseTime.week) {
        newCourse.courseTimes.unshift(nextCourseTime);
        continue;
      }

      const end = stringTimeToMinutes(currentCourseTime.end);
      const start = stringTimeToMinutes(nextCourseTime.start);

      if (Math.abs(end - start) <= MAX_BREAK_TIME_MINUTES) {
        newCourse.courseTimes.unshift(
          {
            week: currentCourseTime.week,
            start: currentCourseTime.end,
            end: nextCourseTime.start,
            classroom: currentCourseTime.classroom,
            concat: true,
          },
          { ...nextCourseTime, concat: true },
        );
        continue;
      }

      newCourse.courseTimes.unshift(nextCourseTime);
    }

    // 마지막에 추가 안된거 보정
    if (courseTimes.length > 0) {
      newCourse.courseTimes.unshift(courseTimes[0]);
    }
    result.push(newCourse);
  });

  return result;
};
