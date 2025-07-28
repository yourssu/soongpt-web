import clsx from 'clsx';
import { motion } from 'motion/react';

import { useCourseItemAnimationVariants } from '@/components/CourseItem/hook';
import { useGetArrayState } from '@/hooks/useGetArrayState';
import { Course } from '@/schemas/courseSchema';

interface SelectableCourseItemProps {
  course: Course;
  isSelected: boolean;
  onClickCourseItem: (course: Course) => void;
}

export const SelectableCourseItem = ({
  onClickCourseItem,
  course,
  isSelected,
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
        'bg-bg-layerDefault flex min-h-[72px] w-full items-center justify-between gap-3 rounded-xl border-2 px-5',
        isSelected && 'text-brandPrimary',
      )}
      initial="initial"
      onClick={handleClick}
      variants={variants}
    >
      <div className="my-2">
        <div className="font-semibold">{course.name}</div>
        {professorArrayState === 'FILLED' && (
          <div className="text-xs font-light">{course.professor.join(', ')} 교수님</div>
        )}
      </div>
      {course.point > 0 && (
        <div className="text-brandSecondary bg-bg-brandLayerLight flex h-6 items-center rounded-lg px-1.5 text-[12px]/[18px] font-semibold text-nowrap">
          {course.point}학점
        </div>
      )}
    </motion.div>
  );
};
