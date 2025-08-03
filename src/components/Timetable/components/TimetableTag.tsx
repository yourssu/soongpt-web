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

export const TimetableTag = () => {
  const { timetable, totalPoint, isSelected } = useTimetableContext();

  return (
    <div className={tag({ isSelected })}>
      <h3 className="text-sm font-semibold">{timetableTagName[timetable.tag]}</h3>
      <button
        className="text-brandPrimary bg-bg-brandLayerLight rounded-lg px-2 py-1 text-xs font-semibold"
        disabled
      >
        {totalPoint}학점
      </button>
    </div>
  );
};
