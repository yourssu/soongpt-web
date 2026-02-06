import { tv } from 'tailwind-variants';

import { useTimetableContext } from '@/components/Timetable/context';
import { timetableTagName } from '@/components/Timetable/type';

const tag = tv({
  base: 'flex items-center justify-between px-[12px] py-[10px]',
  variants: {
    isSelected: {
      true: 'bg-brandPrimary text-white',
      false: 'border-neutralPlaceholder border-b bg-white',
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
      <h3 className="text-[12px] leading-[normal] font-medium tracking-[-0.24px]">{title}</h3>
      <button
        className="text-brandPrimary bg-bg-brandLayerLight h-[28px] rounded-[8px] px-[8px] text-[12px] leading-[18px] font-medium"
        disabled
      >
        {point}학점
      </button>
    </div>
  );
};
