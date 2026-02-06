import { useTimetableContext } from '@/components/Timetable/context';
import { getGridTemplateCols } from '@/components/Timetable/utils/getTimetableGridStyle';

export const TimetableHeadRow = () => {
  const { dayRange, timetable } = useTimetableContext();

  return (
    <div
      className="border-neutralPlaceholder col-span-full grid border-b-1 bg-white"
      style={{ gridTemplateColumns: getGridTemplateCols(dayRange.length) }}
    >
      <div className="border-neutralPlaceholder border-1 bg-white" />
      {dayRange.map((day) => (
        <div
          className="border-neutralPlaceholder flex items-center justify-center border-r-1 px-[2px] py-[8px] text-[12px] leading-[12px] font-medium tracking-[-0.24px] last:border-r-0"
          key={`${timetable.timetableId}-${day}`}
        >
          {day}
        </div>
      ))}
    </div>
  );
};
