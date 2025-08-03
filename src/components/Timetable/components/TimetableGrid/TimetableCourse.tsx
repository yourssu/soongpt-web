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
      className="absolute w-full p-0.5 text-xs font-bold text-white"
      style={getTimetableCourseStyle({ courseName, courseTime })}
    >
      {!courseTime.concat && courseName}
    </div>
  );
};
