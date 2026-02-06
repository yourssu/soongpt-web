import clsx from 'clsx';
import { motion } from 'motion/react';
import { ReactNode } from 'react';

import { useCourseItemAnimationVariants } from '@/components/CourseItem/hook';
import { useGetArrayState } from '@/hooks/useGetArrayState';
import { CourseType } from '@/schemas/courseSchema';

interface SelectableCourseItemProps {
  className?: string;
  course: CourseType;
  description?: ReactNode;
  descriptionClassName?: string;
  extraBadge?: ReactNode;
  isSelected: boolean;
  note?: string;
  onClickCourseItem: (course: CourseType) => void;
  subtitle?: ReactNode;
  subtitleClassName?: string;
  title?: ReactNode;
}

export const SelectableCourseItem = ({
  onClickCourseItem,
  course,
  className,
  extraBadge,
  isSelected,
  title,
  subtitle,
  subtitleClassName,
  description,
  descriptionClassName,
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
        className,
      )}
      initial="initial"
      onClick={handleClick}
      variants={variants}
    >
      <div className="my-2">
        <div className="text-lg font-semibold">{title ?? course.name}</div>
        {subtitle ??
          (professorArrayState === 'FILLED' && (
            <div className={clsx('text-xs', subtitleClassName)}>
              {course.professor.join(', ')} 교수님
            </div>
          ))}
        {description && <div className={clsx('text-xs', descriptionClassName)}>{description}</div>}
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
