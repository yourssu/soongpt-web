import clsx from 'clsx';
import { motion } from 'motion/react';

import { useCourseItemAnimationVariants } from '@/components/CourseItem/hook';
import { useGetArrayState } from '@/hooks/useGetArrayState';
import { CourseType } from '@/schemas/courseSchema';

interface GeneralElectiveCourseItemProps {
  course: CourseType;
  isSelected: boolean;
  onClick: () => void;
}

const getScheduleText = (scheduleRoom: string) => {
  if (!scheduleRoom) {
    return '';
  }

  const first = scheduleRoom.split('\n')[0];
  const match = first.match(/(월|화|수|목|금|토)\s*(\d{1,2}:\d{2})-(\d{1,2}:\d{2})/);

  if (match) {
    return `${match[1]} ${match[2]} ~ ${match[3]}`;
  }

  return first.replace('-', ' ~ ');
};

export const GeneralElectiveCourseItem = ({
  course,
  isSelected,
  onClick,
}: GeneralElectiveCourseItemProps) => {
  const professorArrayState = useGetArrayState(course.professor);
  const variants = useCourseItemAnimationVariants({
    isSelected,
  });
  const fieldBadge = course.subCategory ?? course.field ?? '';

  return (
    <motion.div
      animate="animate"
      className={clsx(
        'flex w-full items-center justify-between gap-3 rounded-[20px] border-2 bg-white px-4 py-4',
        isSelected && 'text-brandPrimary',
      )}
      initial="initial"
      onClick={onClick}
      variants={variants}
    >
      <div className="flex flex-1 flex-col gap-0.5">
        <div className="text-lg font-semibold">{course.name}</div>
        {professorArrayState === 'FILLED' && (
          <div className="text-xs">{course.professor.join(', ')} 교수님</div>
        )}
        <div className="text-xs text-black">{getScheduleText(course.scheduleRoom)}</div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {fieldBadge.length > 0 && (
          <div className="text-neutral flex h-6 items-center rounded-lg bg-[#eaeaea] px-2 text-[12px]/[18px]">
            {fieldBadge}
          </div>
        )}
        {course.point > 0 && (
          <div className="text-brandSecondary bg-bg-brandLayerLight flex h-6 items-center rounded-lg px-2 text-[12px]/[18px] text-nowrap">
            {course.point}학점
          </div>
        )}
      </div>
    </motion.div>
  );
};
