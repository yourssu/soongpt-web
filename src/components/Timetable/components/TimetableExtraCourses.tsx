import { useTimetableContext } from '@/components/Timetable/context';
import { getGridTemplateCols } from '@/components/Timetable/utils/getTimetableGridStyle';
import { TimetableCourseType } from '@/schemas/timetableSchema';

interface TimetableExtraCoursesProps {
  extraCourses: TimetableCourseType[];
}

export const TimetableExtraCourses = ({ extraCourses }: TimetableExtraCoursesProps) => {
  const { dayRange, timetable } = useTimetableContext();

  return (
    <div
      className="border-neutralPlaceholder grid w-full border-t-1 py-2 text-xs font-semibold"
      style={{
        gridTemplateColumns: getGridTemplateCols(dayRange.length),
      }}
    >
      <div className="col-start-2 -col-end-1 flex flex-col gap-0.5">
        {extraCourses.map((course) => (
          <div key={`${timetable.timetableId}-${course.code}`}>{course.name}</div>
        ))}
      </div>
    </div>
  );
};
