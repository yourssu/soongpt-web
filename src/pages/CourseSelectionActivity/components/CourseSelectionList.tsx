import { useContext } from 'react';

import { CourseList } from '@/components/CourseItem/CourseList';
import { SelectedCoursesContext } from '@/pages/CourseSelectionActivity/context';
import { SelectedCourseType } from '@/pages/CourseSelectionActivity/type';
import { CourseType } from '@/schemas/courseSchema';
import { isSameCourse } from '@/utils/course';

interface CourseSelectionListProps {
  courses: CourseType[];
  parseSelectedCourseOnPush?: (course: CourseType) => SelectedCourseType;
  renderNote?: (course: CourseType) => string | undefined;
}

export const CourseSelectionList = ({
  courses,
  parseSelectedCourseOnPush,
  renderNote,
}: CourseSelectionListProps) => {
  const { selectedCourses, setSelectedCourses } = useContext(SelectedCoursesContext);

  const isSelected = (course: CourseType) =>
    selectedCourses.some((selectedCourse) => isSameCourse(course, selectedCourse));

  const handleToggle = (course: CourseType) => {
    const selected = isSelected(course);
    const parsedCourse = parseSelectedCourseOnPush?.(course) ?? course;
    setSelectedCourses((prev) =>
      selected
        ? prev.filter((selectedCourse) => !isSameCourse(course, selectedCourse))
        : [...prev, parsedCourse],
    );
  };

  return (
    <CourseList
      combineCourses
      courses={courses}
      isSelected={isSelected}
      onToggle={handleToggle}
      renderNote={renderNote}
    />
  );
};
