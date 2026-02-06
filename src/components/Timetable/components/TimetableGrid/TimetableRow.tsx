import { TimetableCourse } from '@/components/Timetable/components/TimetableGrid/TimetableCourse';
import { useTimetableContext } from '@/components/Timetable/context';
import { InjectedTimetableCourseTime } from '@/components/Timetable/type';
import { parseCourseTime } from '@/components/Timetable/utils/parseCourseTime';

export const TimetableRow = ({ hour }: { hour: number }) => {
  const { dayRange, timetable, courses } = useTimetableContext();

  const matchRenderableCourseTimes = ({
    courseTime,
    day,
  }: {
    courseTime: InjectedTimetableCourseTime;
    day: string;
  }) => {
    const { week, start } = courseTime;
    const { hour: startHour } = parseCourseTime(start);

    const weekMatched = week === day;
    const hourMatched = startHour === hour;

    return weekMatched && hourMatched;
  };

  return (
    <div className="border-neutralPlaceholder col-span-full grid grid-cols-subgrid border-b-1 last:border-b-0">
      <div className="border-neutralPlaceholder flex items-center justify-center border-r-1 bg-white px-[2px] py-[8px] text-center text-[12px] leading-[12px] font-medium tracking-[-0.24px]">
        {hour}
      </div>

      {dayRange.map((day) => {
        return (
          <div
            className="border-neutralPlaceholder relative border-r-1 bg-white last:border-r-0"
            key={`${timetable.timetableId}-${hour}-${day}`}
          >
            {courses.map(({ name, courseTimes }) => {
              const renderableCourseTimes = courseTimes.filter((courseTime) =>
                matchRenderableCourseTimes({
                  courseTime,
                  day,
                }),
              );
              return renderableCourseTimes.map((courseTime) => (
                <TimetableCourse
                  courseName={name}
                  courseTime={courseTime}
                  key={`${timetable.timetableId}-${name}-${courseTime.week}-${courseTime.start}-${courseTime.end}`}
                />
              ));
            })}
          </div>
        );
      })}
    </div>
  );
};
