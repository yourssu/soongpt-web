import { useState } from 'react';

import { Timetable } from '@/components/Timetable';
import { TimetableType } from '@/schemas/timetableSchema';

interface TimetableListProps {
  timetables: TimetableType[];
}

export const TimetableList = ({ timetables }: TimetableListProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return timetables.map((timetable, index) => (
    <div
      className="pt-4 first:pt-0"
      key={timetable.timetableId}
      onClick={(e) => {
        setSelectedIndex(index);
        e.currentTarget.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }}
    >
      <Timetable isSelected={index === selectedIndex} timetable={timetable} />
    </div>
  ));
};
