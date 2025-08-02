import { tv } from 'tailwind-variants';

import { TimetableExtraCourses } from '@/components/Timetable/components/TimetableExtraCourses';
import { TimetableGrid } from '@/components/Timetable/components/TimetableGrid';
import { TimetableSkeleton } from '@/components/Timetable/components/TimetableSkeleton';
import { TimetableTag } from '@/components/Timetable/components/TimetableTag';
import { TimetableContext } from '@/components/Timetable/context';
import { useBreaktimeInjectedCourses } from '@/components/Timetable/hooks/useBreaktimeInjectedCourses';
import { useTimetableDayRange } from '@/components/Timetable/hooks/useTimetableDayRange';
import { useTimetableHourRange } from '@/components/Timetable/hooks/useTimetableHourRange';
import { useCoursesTotalPoint } from '@/hooks/course/useCoursesTotalPoint';
import { TimetableCourseType, TimetableType } from '@/schemas/timetableSchema';
export const getTotalCredit = (courses: TimetableCourseType[]): number => {
  return courses.reduce((acc, course) => acc + course.point, 0);
};

export const getMajorCredit = (courses: TimetableCourseType[]): number => {
  return courses.reduce((acc, course) => {
    if (course.category === 'MAJOR_REQUIRED' || course.category === 'MAJOR_ELECTIVE') {
      return acc + course.point;
    }
    return acc;
  }, 0);
};

interface TimetableProps {
  isSelected?: boolean;
  timetable: TimetableType;
}

const container = tv({
  base: 'w-full overflow-hidden rounded-xl border-2 transition-colors duration-300',
  variants: {
    isSelected: {
      true: 'border-brandPrimary',
      false: 'border-neutralPlaceholder',
    },
  },
});

export const Timetable = ({ timetable, isSelected }: TimetableProps) => {
  const courses = useBreaktimeInjectedCourses(timetable.courses);
  const emptyCourseTimeCourses = courses.filter((course) => course.courseTimes.length === 0);

  const totalPoint = useCoursesTotalPoint(courses);
  const days = useTimetableDayRange(courses);
  const hours = useTimetableHourRange(courses);

  return (
    <TimetableContext.Provider
      value={{
        dayRange: days,
        hourRange: hours,
        timetable,
        totalPoint,
        courses,
        isSelected,
      }}
    >
      <div className={container({ isSelected })}>
        <TimetableTag />

        <TimetableGrid />

        {emptyCourseTimeCourses.length > 0 && (
          <TimetableExtraCourses extraCourses={emptyCourseTimeCourses} />
        )}
      </div>
    </TimetableContext.Provider>
  );
};

Timetable.Skeleton = TimetableSkeleton;
