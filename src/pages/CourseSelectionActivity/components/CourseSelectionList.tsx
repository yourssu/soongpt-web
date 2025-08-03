import { motion } from 'motion/react';
import { useContext } from 'react';

import { SelectableCourseItem } from '@/components/CourseItem/SelectableCourseItem';
import { useCombinedCourses } from '@/hooks/course/useCombinedCourses';
import { SelectedCoursesContext } from '@/pages/CourseSelectionActivity/context';
import { SelectedCourseType } from '@/pages/CourseSelectionActivity/type';
import { CourseType } from '@/schemas/courseSchema';
import { isSameCourse } from '@/utils/course';

interface CourseSelectionListProps {
  courses: CourseType[];
  parseSelectedCourseOnPush?: (course: CourseType) => SelectedCourseType;
}

export const CourseSelectionList = ({
  courses,
  parseSelectedCourseOnPush,
}: CourseSelectionListProps) => {
  const { selectedCourses, setSelectedCourses } = useContext(SelectedCoursesContext);
  const uniqueCourses = useCombinedCourses(courses);

  return (
    <motion.div
      animate={{ y: 0, opacity: 1 }}
      initial={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="flex flex-1 flex-col gap-3.5">
        {uniqueCourses.map((course) => {
          const isSelected = selectedCourses.some((selectedCourse) =>
            isSameCourse(course, selectedCourse),
          );

          const handleClickCourseItem = () => {
            const parsedCourse = parseSelectedCourseOnPush?.(course) ?? course;
            setSelectedCourses((prev) =>
              isSelected
                ? prev.filter((selectedCourse) => !isSameCourse(course, selectedCourse))
                : [...prev, parsedCourse],
            );
          };

          return (
            <SelectableCourseItem
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
