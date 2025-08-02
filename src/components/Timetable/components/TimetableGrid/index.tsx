import { TimetableHeadRow } from '@/components/Timetable/components/TimetableGrid/TimetableHeadRow';
import { TimetableRow } from '@/components/Timetable/components/TimetableGrid/TimetableRow';
import { useTimetableContext } from '@/components/Timetable/context';
import {
  getGridTemplateCols,
  getGridTemplateRows,
} from '@/components/Timetable/utils/getTimetableGridStyle';

export const TimetableGrid = () => {
  const { dayRange, hourRange, timetable } = useTimetableContext();

  return (
    <div
      className="divide-neutralPlaceholder grid"
      style={{
        gridTemplateColumns: getGridTemplateCols(dayRange.length),
        gridTemplateRows: getGridTemplateRows(hourRange.length),
      }}
    >
      <TimetableHeadRow />
      {hourRange.map((hour) => (
        <TimetableRow hour={hour} key={`${timetable.timetableId}-${hour}`} />
      ))}
    </div>
  );
};
