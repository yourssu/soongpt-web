import { InjectedTimetableCourseTime } from '@/components/Timetable/type';
import { getTimetableCourseStyle } from '@/components/Timetable/utils/getTimetableCourseStyle';

export const TimetableCourse = ({
  courseName,
  courseTime,
}: {
  courseName: string;
  courseTime: InjectedTimetableCourseTime;
}) => {
  return (
    <div
      className="absolute right-0 left-0 p-[2px] text-[12px] leading-[12px] font-medium tracking-[-0.24px] text-[#f7f8f8]"
      style={getTimetableCourseStyle({ courseName, courseTime })}
    >
      {!courseTime.concat && courseName}
    </div>
  );
};
