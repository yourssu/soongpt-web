import { motion } from 'motion/react';

import { Course } from '@/schemas/courseSchema';

interface CourseListItemProps {
  course: Course;
  isSelected: boolean;
  onClickCourseItem: (course: Course) => void;
}

const CourseListItem = ({ onClickCourseItem, course, isSelected }: CourseListItemProps) => {
  const handleClick = () => {
    onClickCourseItem(course);
  };

  return (
    <motion.div
      animate={
        course.credit === 0
          ? {
              opacity: [1, 0.5, 1],
              scale: [1, 0.98, 1],
            }
          : {
              borderColor: isSelected ? 'rgba(107, 92, 255, 1)' : 'rgba(107, 92, 255, 0)',
            }
      }
      className={`bg-bg-layerDefault flex min-h-[72px] w-full items-center justify-between gap-3 rounded-xl border-2 px-5 ${
        isSelected ? 'text-brandPrimary' : ''
      }`}
      initial={{ borderColor: 'rgba(107, 92, 255, 0)' }}
      onClick={handleClick}
      transition={
        course.credit === 0
          ? {
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }
          : { duration: 0.1 }
      }
    >
      <div className="my-2">
        <div className="text-[20px] font-semibold">{course.courseName}</div>
        <div className="text-[12px] font-light">{course.professorName}</div>
      </div>
      {course.credit > 0 && (
        <div className="text-brandSecondary bg-bg-brandLayerLight flex h-6 items-center rounded-lg px-1.5 text-[12px]/[18px] font-semibold text-nowrap">
          {course.credit}학점
        </div>
      )}
    </motion.div>
  );
};

export default CourseListItem;
