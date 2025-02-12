import { createContext, ElementType, HTMLAttributes, useContext } from 'react';
import { twMerge } from 'tailwind-merge';
import { CourseTime, CourseWithoutTarget } from '../schemas/courseSchema';
import { TimetableTag, Timetable as TimetableType } from '../schemas/timetableSchema';

const MINUTES_PER_SLOT = 5;
export const SLOT_HEIGHT = 3.5;

const TIME_TABLE_COLOR = [
  '#D497EE',
  '#9E86E1',
  '#7AA5E9',
  '#7CD1C1',
  '#77CA88',
  '#A7C970',
  '#ECC369',
  '#fcaa67',
  '#f08676',
];

const TIME_TABLE_TAG: Record<TimetableTag, string> = {
  DEFAULT: '🤔 뭔가 좋아보이는 시간표',
  HAS_FREE_DAY: '🥳 공강 날이 있는 시간표',
  NO_MORNING_CLASSES: '⏰ 아침 수업이 없는 시간표',
  NO_LONG_BREAKS: '🚀 우주 공강이 없는 시간표 ',
  EVENLY_DISTRIBUTED: '⚖️ 균등하게 배분되어 있는 시간표',
  GUARANTEED_LUNCH_TIME: '🍔 점심시간 보장되는 시간표',
  NO_EVENING_CLASSES: '🛏 저녁수업이 없는 시간표',
};

export const getTotalCredit = (courses: CourseWithoutTarget[]): number => {
  return courses.reduce((acc, course) => acc + course.credit, 0);
};

export const getMajorCredit = (courses: CourseWithoutTarget[]): number => {
  return courses.reduce((acc, course) => {
    if (course.classification === 'MAJOR_REQUIRED' || course.classification === 'MAJOR_ELECTIVE') {
      return acc + course.credit;
    }

    return acc;
  }, 0);
};

const getDays = (courses: CourseWithoutTarget[]): string[] => {
  const hasWeekend = courses.some((course) => course.courseTime.some((time) => time.week === '토'));

  const baseDays = ['월', '화', '수', '목', '금'];
  return hasWeekend ? [...baseDays, '토'] : baseDays;
};

const getTimeRange = (courses: CourseWithoutTarget[]): number[] => {
  const earliestHour = 9;
  let latestHour = 0;

  courses.forEach((course) => {
    course.courseTime.forEach((time) => {
      const endHour = Number(time.end.split(':')[0]);

      latestHour = Math.max(latestHour, endHour);
    });
  });

  return Array.from({ length: latestHour - earliestHour + 1 }, (_, i) => i + earliestHour);
};

export const getGridTemplateCols = (length: number): string => {
  return `1fr repeat(${length}, 3fr)`;
};

export const getGridTemplateRows = (length: number): string => {
  const headerHeight = SLOT_HEIGHT * 6;
  return `${headerHeight}px repeat(${length}, ${SLOT_HEIGHT * 12}px)`;
};

const getCoursePosition = (courseTime: CourseTime): { top: number; height: number } => {
  const [startHour, startMinute] = courseTime.start.split(':').map(Number);
  const [endHour, endMinute] = courseTime.end.split(':').map(Number);

  const start = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;

  const top = (startMinute / MINUTES_PER_SLOT) * SLOT_HEIGHT;
  const height = ((end - start) / MINUTES_PER_SLOT) * SLOT_HEIGHT;

  return { top, height };
};

const getLineClamp = (courseTime: CourseTime): number => {
  const [startHour, startMinute] = courseTime.start.split(':').map(Number);
  const [endHour, endMinute] = courseTime.end.split(':').map(Number);

  const start = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;

  // 50분 이하 2줄 제한
  if (end - start <= 50) {
    return 2;
  }
  // 1시간 15분 이하 3줄 제한
  else if (end - start <= 75) {
    return 3;
  } else {
    return 4;
  }
};

interface TimetableProps extends HTMLAttributes<HTMLDivElement> {
  timetable: TimetableType;
}

interface TimetableHeaderProps extends HTMLAttributes<HTMLDivElement> {
  as?: ElementType;
  bgColor?: string;
  textColor?: string;
}

const TimetableContext = createContext<{
  totalCredit: number;
  tag: TimetableTag;
}>({
  totalCredit: 0,
  tag: 'DEFAULT',
});

const DefaultHeader = ({ className }: TimetableHeaderProps) => {
  const { totalCredit, tag } = useContext(TimetableContext);

  return (
    <div className={`flex items-center justify-between py-2.5 pr-2.5 pl-5 ${twMerge(className)}`}>
      <h3 className="text-sm font-semibold">{TIME_TABLE_TAG[tag]}</h3>
      <button
        className="text-primary bg-credit-chip rounded-lg px-2 py-1 text-xs font-semibold"
        disabled
      >
        {totalCredit}학점
      </button>
    </div>
  );
};

export const SharingHeader = ({ bgColor, textColor }: TimetableHeaderProps) => {
  const { tag } = useContext(TimetableContext);

  return (
    <div
      className={`relative h-6`}
      style={{
        color: textColor,
      }}
    >
      <div
        className={`absolute top-0 left-1/2 flex -translate-x-1/2 items-center rounded-b-xl px-4 py-1 whitespace-nowrap`}
        style={{
          background: bgColor,
        }}
      >
        <h3 className="text-xs font-semibold">{TIME_TABLE_TAG[tag]}</h3>
      </div>
    </div>
  );
};

const TimetableHeader = ({ as: Header = DefaultHeader, ...props }: TimetableHeaderProps) => {
  return <Header {...props} />;
};

const Timetable = ({ children, timetable, className, ...props }: TimetableProps) => {
  const courses = timetable.courses;

  const totalCredit = getTotalCredit(courses);
  const days = getDays(courses);
  const timeRange = getTimeRange(courses);

  return (
    <TimetableContext.Provider value={{ totalCredit, tag: timetable.tag }}>
      <div
        className={`${twMerge('w-full overflow-hidden rounded-xl border-2', className)}`}
        {...props}
      >
        {/* Timetable Header */}
        {children}
        <div
          className="divide-placeholder grid"
          style={{
            gridTemplateColumns: getGridTemplateCols(days.length),
            gridTemplateRows: getGridTemplateRows(timeRange.length),
          }}
        >
          {/* Header row */}
          <div className="border-placeholder col-span-full grid grid-cols-subgrid border-b-1">
            <div className="border-placeholder border-r-1"></div>
            {days.map((day) => (
              <div
                key={`${timetable.timetableId}-${day}`}
                className="border-placeholder flex items-center justify-center border-r-1 text-xs font-light last:border-r-0"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Time rows */}
          {timeRange.map((tableTime) => (
            <div
              key={`${timetable.timetableId}-${tableTime}`}
              className="border-placeholder col-span-full grid grid-cols-subgrid border-b-1 last:border-b-0"
            >
              <div className="border-placeholder flex justify-end border-r-1 p-0.5 text-xs font-light">
                {tableTime}
              </div>
              {days.map((tableDay) => (
                <div
                  key={`${timetable.timetableId}-${tableTime}-${tableDay}`}
                  className="border-placeholder relative border-r-1 last:border-r-0"
                >
                  {courses.map((course) => {
                    const courseTime = course.courseTime.find(
                      (time) =>
                        time.week === tableDay && Number(time.start.split(':')[0]) === tableTime,
                    );
                    if (courseTime) {
                      const { top, height } = getCoursePosition(courseTime);
                      const bgColor =
                        TIME_TABLE_COLOR[course.courseName.length % TIME_TABLE_COLOR.length];

                      return (
                        <div
                          key={`${timetable.timetableId}-${course.courseName}-${courseTime.start}`}
                          className="absolute w-full p-0.5 text-xs font-bold text-white"
                          style={{
                            backgroundColor: bgColor,
                            borderColor: bgColor,
                            top: `${top}px`,
                            height: `${height}px`,
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: getLineClamp(courseTime),
                            overflow: 'hidden',
                          }}
                        >
                          {course.courseName}
                        </div>
                      );
                    }
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </TimetableContext.Provider>
  );
};

Timetable.Header = TimetableHeader;

export default Timetable;
