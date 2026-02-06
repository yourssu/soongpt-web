import { tv } from 'tailwind-variants';

import { useTimetableContext } from '@/components/Timetable/context';
import { timetableTagName } from '@/components/Timetable/type';

const tag = tv({
  base: 'flex items-center justify-between py-2.5 pr-2.5 pl-5',
  variants: {
    isSelected: {
      true: 'bg-brandPrimary text-white',
      false: 'border-neutralPlaceholder border-b-1',
    },
  },
});

interface TimetableTagProps {
  pointOverride?: number;
  titleOverride?: string;
}

export const TimetableTag = ({ pointOverride, titleOverride }: TimetableTagProps) => {
  const { timetable, totalPoint, isSelected } = useTimetableContext();
  const title = titleOverride ?? timetableTagName[timetable.tag];
  const point = pointOverride ?? totalPoint;

  return (
    <div className={tag({ isSelected })}>
      <h3 className="text-sm font-semibold">{title}</h3>
      <button
        className="text-brandPrimary bg-bg-brandLayerLight rounded-lg px-2 py-1 text-xs font-semibold"
        disabled
      >
        {point}학점
      </button>
    </div>
  );
};
