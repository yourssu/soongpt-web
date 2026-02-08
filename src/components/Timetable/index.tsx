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
import { TimetableType } from '@/schemas/timetableSchema';

interface TimetableProps {
  isSelected?: boolean;
  tagPointOverride?: number;
  tagTitleOverride?: string;
  timetable: TimetableType;
}

const container = tv({
  base: 'mx-auto w-full max-w-[var(--timetable-max-width)] overflow-hidden rounded-[12px] border transition-colors duration-300',
  variants: {
    isSelected: {
      true: 'border-brandPrimary',
      false: 'border-neutralPlaceholder',
    },
  },
  defaultVariants: {
    isSelected: false,
  },
});

export const Timetable = ({
  timetable,
  isSelected,
  tagPointOverride,
  tagTitleOverride,
}: TimetableProps) => {
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
        <TimetableTag pointOverride={tagPointOverride} titleOverride={tagTitleOverride} />

        <TimetableGrid />

        {emptyCourseTimeCourses.length > 0 && (
          <TimetableExtraCourses extraCourses={emptyCourseTimeCourses} />
        )}
      </div>
    </TimetableContext.Provider>
  );
};

Timetable.Skeleton = TimetableSkeleton;
