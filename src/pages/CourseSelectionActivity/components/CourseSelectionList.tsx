import { uniqBy } from 'es-toolkit';
import { motion } from 'motion/react';
import { useContext, useMemo } from 'react';

import CourseListItem from '@/pages/CourseSelectionActivity/components/CourseListItem';
import { SelectedCoursesContext } from '@/pages/CourseSelectionActivity/context';
import { Course } from '@/schemas/courseSchema';
import { extractComparableCourseCode, isSameCourse } from '@/utils/course';

interface CourseSelectionListProps {
  courses: Course[];
}

export const CourseSelectionList = ({ courses }: CourseSelectionListProps) => {
  const { selectedCourses, setSelectedCourses } = useContext(SelectedCoursesContext);

  const uniqueCourses = useMemo(() => uniqBy(courses, extractComparableCourseCode), [courses]);

  return (
    <motion.div
      animate={{ y: 0, opacity: 1 }}
      className="overflow-auto"
      initial={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="flex flex-1 flex-col gap-3.5">
        {uniqueCourses.map((course) => {
          const isSelected = selectedCourses.some((selectedCourse) =>
            isSameCourse(course, selectedCourse),
          );

          const handleClickCourseItem = () => {
            setSelectedCourses((prev) =>
              isSelected
                ? prev.filter((selectedCourse) => !isSameCourse(course, selectedCourse))
                : [...prev, course],
            );
          };

          return (
            <CourseListItem
              course={course}
              isSelected={isSelected}
              key={course.code}
              onClickCourseItem={handleClickCourseItem}
            />
          );
        })}
      </div>
    </motion.div>
  );
};
