import { useTimetableContext } from '@/components/Timetable/context';

export const TimetableHeadRow = () => {
  const { dayRange, timetable } = useTimetableContext();

  return (
    <div className="border-neutralPlaceholder col-span-full grid grid-cols-subgrid border-b-1">
      <div className="border-neutralPlaceholder border-r-1" />
      {dayRange.map((day) => (
        <div
          className="border-neutralPlaceholder flex items-center justify-center border-r-1 text-xs font-light last:border-r-0"
          key={`${timetable.timetableId}-${day}`}
        >
          {day}
        </div>
      ))}
    </div>
  );
};
