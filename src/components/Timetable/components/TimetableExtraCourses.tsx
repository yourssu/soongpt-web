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
      className="border-neutralPlaceholder grid w-full border-t px-[12px] py-[10px] text-[12px] font-medium tracking-[-0.24px]"
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
