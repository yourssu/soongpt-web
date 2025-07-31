import { createContext, ElementType, HTMLAttributes, useContext } from 'react';
import { twMerge } from 'tailwind-merge';

import { CourseTime } from '@/schemas/courseSchema';
import {
  TimetableCourse,
  TimetableTag,
  Timetable as TimetableType,
} from '@/schemas/timetableSchema';

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
  '기본 태그': '🤔 뭔가 좋아보이는 시간표',
  '공강 날이 있는 시간표': '🥳 공강 날이 있는 시간표',
  '아침 수업이 없는 시간표': '⏰ 아침 수업이 없는 시간표',
  '우주 공강이 없는 시간표': '🚀 우주 공강이 없는 시간표 ',
  '점심시간 보장되는 시간표': '🍔 점심시간 보장되는 시간표',
  '저녁수업이 없는 시간표': '🛏 저녁수업이 없는 시간표',
};

export const getTotalCredit = (courses: TimetableCourse[]): number => {
  return courses.reduce((acc, course) => acc + course.point, 0);
};

export const getMajorCredit = (courses: TimetableCourse[]): number => {
  return courses.reduce((acc, course) => {
    if (course.category === 'MAJOR_REQUIRED' || course.category === 'MAJOR_ELECTIVE') {
      return acc + course.point;
    }
    return acc;
  }, 0);
};

const getDays = (courses: TimetableCourse[]): string[] => {
  const hasWeekend = courses.some((course) =>
    course.courseTimes.some((time) => time.week === '토'),
  );

  const baseDays = ['월', '화', '수', '목', '금'];
  return hasWeekend ? [...baseDays, '토'] : baseDays;
};

const getTimeRange = (courses: TimetableCourse[]): number[] => {
  const earliestHour = 9;
  let latestHour = 0;

  courses.forEach((course) => {
    course.courseTimes.forEach((time) => {
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

const getCoursePosition = (courseTime: CourseTime): { height: number; top: number } => {
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
  tag: TimetableTag;
  totalCredit: number;
}>({
  totalCredit: 0,
  tag: '기본 태그',
});

const DefaultHeader = ({ className }: TimetableHeaderProps) => {
  const { totalCredit, tag } = useContext(TimetableContext);

  return (
    <div className={`flex items-center justify-between py-2.5 pr-2.5 pl-5 ${twMerge(className)}`}>
      <h3 className="text-sm font-semibold">{TIME_TABLE_TAG[tag]}</h3>
      <button
        className="text-brandPrimary bg-bg-brandLayerLight rounded-lg px-2 py-1 text-xs font-semibold"
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
  const emptyCourseTimeCourses = courses.filter((course) => course.courseTimes.length === 0);

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
          className="divide-neutralPlaceholder grid"
          style={{
            gridTemplateColumns: getGridTemplateCols(days.length),
            gridTemplateRows: getGridTemplateRows(timeRange.length),
          }}
        >
          {/* Header row */}
          <div className="border-neutralPlaceholder col-span-full grid grid-cols-subgrid border-b-1">
            <div className="border-neutralPlaceholder border-r-1" />
            {days.map((day) => (
              <div
                className="border-neutralPlaceholder flex items-center justify-center border-r-1 text-xs font-light last:border-r-0"
                key={`${timetable.timetableId}-${day}`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Time rows */}
          {timeRange.map((tableTime) => (
            <div
              className="border-neutralPlaceholder col-span-full grid grid-cols-subgrid border-b-1 last:border-b-0"
              key={`${timetable.timetableId}-${tableTime}`}
            >
              <div className="border-neutralPlaceholder flex justify-end border-r-1 p-0.5 text-xs font-light">
                {tableTime}
              </div>
              {days.map((tableDay) => (
                <div
                  className="border-neutralPlaceholder relative border-r-1 last:border-r-0"
                  key={`${timetable.timetableId}-${tableTime}-${tableDay}`}
                >
                  {courses.map((course) => {
                    const courseTime = course.courseTimes.find(
                      (time) =>
                        time.week === tableDay && Number(time.start.split(':')[0]) === tableTime,
                    );

                    if (!courseTime) {
                      return undefined;
                    }

                    const { top, height } = getCoursePosition(courseTime);
                    const bgColor = TIME_TABLE_COLOR[course.name.length % TIME_TABLE_COLOR.length];
                    return (
                      <div
                        className="absolute w-full p-0.5 text-xs font-bold text-white"
                        key={`${timetable.timetableId}-${course.name}-${courseTime.start}`}
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
                        {course.name}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
        {emptyCourseTimeCourses.length > 0 && (
          <div
            className="border-neutralPlaceholder grid w-full border-t-1 py-2 text-xs font-semibold"
            style={{
              gridTemplateColumns: getGridTemplateCols(days.length),
            }}
          >
            <div className="col-start-2 -col-end-1 flex flex-col gap-0.5">
              {emptyCourseTimeCourses.map((course) => (
                <div key={`${timetable.timetableId}-${course.code}`}>{course.name}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </TimetableContext.Provider>
  );
};

Timetable.Header = TimetableHeader;

export default Timetable;
