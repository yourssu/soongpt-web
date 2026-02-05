import clsx from 'clsx';
import { motion } from 'motion/react';
import { ReactNode } from 'react';

import { useCourseItemAnimationVariants } from '@/components/CourseItem/hook';
import { useGetArrayState } from '@/hooks/useGetArrayState';
import { CourseType } from '@/schemas/courseSchema';

interface SelectableCourseItemProps {
  course: CourseType;
  extraBadge?: ReactNode;
  isSelected: boolean;
  note?: string;
  onClickCourseItem: (course: CourseType) => void;
}

export const SelectableCourseItem = ({
  onClickCourseItem,
  course,
  extraBadge,
  isSelected,
  note,
}: SelectableCourseItemProps) => {
  const professorArrayState = useGetArrayState(course.professor);

  const variants = useCourseItemAnimationVariants({
    isSelected,
    pulse: course.point === 0,
  });

  const handleClick = () => {
    onClickCourseItem(course);
  };

  return (
    <motion.div
      animate="animate"
      className={clsx(
        'flex min-h-[80px] w-full items-center justify-between gap-3 rounded-xl border-2 bg-white px-5',
        isSelected && 'text-brandPrimary',
      )}
      initial="initial"
      onClick={handleClick}
      variants={variants}
    >
      <div className="my-2">
        <div className="text-lg font-semibold">{course.name}</div>
        {professorArrayState === 'FILLED' && (
          <div className="text-xs">{course.professor.join(', ')} 교수님</div>
        )}
        {note && <div className="text-xs font-light text-[#FF474A]">{note}</div>}
      </div>
      <div className="flex shrink-0 items-center gap-0.5">
        {extraBadge}
        {course.point > 0 && (
          <div className="text-brandSecondary bg-bg-brandLayerLight flex h-6 items-center rounded-lg px-2 text-[12px]/[18px] text-nowrap">
            {course.point}학점
          </div>
        )}
      </div>
    </motion.div>
  );
};
