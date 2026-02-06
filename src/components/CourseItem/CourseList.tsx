import { motion } from 'motion/react';
import { ReactNode } from 'react';

import { SelectableCourseItem } from '@/components/CourseItem/SelectableCourseItem';
import { useCombinedCourses } from '@/hooks/course/useCombinedCourses';
import { CourseType } from '@/schemas/courseSchema';

interface CourseListProps {
  combineCourses?: boolean;
  courses: CourseType[];
  emptyState?: ReactNode;
  isSelected: (course: CourseType) => boolean;
  itemClassName?: string;
  listClassName?: string;
  onToggle: (course: CourseType) => void;
  renderDescription?: (course: CourseType) => ReactNode;
  renderExtraBadge?: (course: CourseType) => ReactNode;
  renderNote?: (course: CourseType) => string | undefined;
  renderSubtitle?: (course: CourseType) => ReactNode;
}

export const CourseList = ({
  courses,
  isSelected,
  onToggle,
  renderNote,
  renderSubtitle,
  renderDescription,
  renderExtraBadge,
  itemClassName,
  listClassName,
  combineCourses = false,
  emptyState,
}: CourseListProps) => {
  const combinedCourses = useCombinedCourses(courses);
  const visibleCourses = combineCourses ? combinedCourses : courses;

  if (visibleCourses.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <motion.div
      animate={{ y: 0, opacity: 1 }}
      initial={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className={`flex flex-1 flex-col ${listClassName ?? 'gap-3.5'}`}>
        {visibleCourses.map((course) => {
          const selected = isSelected(course);
          return (
            <SelectableCourseItem
              className={itemClassName}
              course={course}
              description={renderDescription?.(course)}
              extraBadge={renderExtraBadge?.(course)}
              isSelected={selected}
              key={course.code}
              note={renderNote?.(course)}
              onClickCourseItem={() => onToggle(course)}
              subtitle={renderSubtitle?.(course)}
              subtitleClassName={selected ? 'text-brandPrimary' : undefined}
            />
          );
        })}
      </div>
    </motion.div>
  );
};
