import { useTimetableContext } from '@/components/Timetable/context';

export const TimetableHeadRow = () => {
  const { dayRange, timetable } = useTimetableContext();

  return (
    <div className="border-neutralPlaceholder col-span-full grid grid-cols-subgrid border-b-1 bg-white">
      <div className="border-neutralPlaceholder border-r-1 bg-white" />
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
